/**
 * Attendance Form Component
 * School Advisories System
 * 
 * Form for professors to register student attendance in sessions
 */

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Button,
  Alert,
  Chip,
  CircularProgress,
  Stack,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  CheckCircle as PresentIcon,
  Cancel as AbsentIcon,
  AccessTime as LateIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { registerBulkAttendance } from '@/api/endpoints/attendance';
import type { User, AttendanceStatus } from '@/types';

/**
 * Attendance Record Type
 */
interface AttendanceRecord {
  student_id: number;
  attendance_status: AttendanceStatus;
  notes?: string;
}

/**
 * Component Props
 */
interface AttendanceFormProps {
  /** Session ID */
  sessionId: number;
  /** List of enrolled students */
  students: User[];
  /** Existing attendance records (for editing) */
  existingAttendance?: AttendanceRecord[];
  /** Callback when attendance is saved */
  onSuccess?: () => void;
}

/**
 * Attendance Form Component
 */
export function AttendanceForm({
  sessionId,
  students,
  existingAttendance = [],
  onSuccess,
}: AttendanceFormProps) {
  const queryClient = useQueryClient();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Initialize attendance records
  useEffect(() => {
    const initialRecords = students.map((student) => {
      const existing = existingAttendance.find((a) => a.student_id === student.user_id);
      return {
        student_id: student.user_id,
        attendance_status: existing?.attendance_status || ('PRESENT' as AttendanceStatus),
        notes: existing?.notes || '',
      };
    });
    setAttendanceRecords(initialRecords);
  }, [students, existingAttendance]);

  // Save attendance mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      await registerBulkAttendance(sessionId, { attendances: attendanceRecords });
    },
    onSuccess: () => {
      toast.success('Asistencia registrada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['session-attendance', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['my-advisories'] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      const errorMessage = apiError.response?.data?.message || 'Error al registrar asistencia';
      toast.error(errorMessage);
    },
  });

  /**
   * Update student attendance status
   */
  const handleStatusChange = (studentId: number, status: AttendanceStatus | null) => {
    if (!status) return;
    
    setAttendanceRecords((prev) =>
      prev.map((record) =>
        record.student_id === studentId
          ? { ...record, attendance_status: status }
          : record
      )
    );
  };

  /**
   * Update student notes
   */
  const handleNotesChange = (studentId: number, notes: string) => {
    setAttendanceRecords((prev) =>
      prev.map((record) =>
        record.student_id === studentId ? { ...record, notes } : record
      )
    );
  };

  /**
   * Get attendance statistics
   */
  const getStatistics = () => {
    const present = attendanceRecords.filter((r) => r.attendance_status === 'PRESENT').length;
    const absent = attendanceRecords.filter((r) => r.attendance_status === 'ABSENT').length;
    const late = attendanceRecords.filter((r) => r.attendance_status === 'LATE').length;
    return { present, absent, late, total: students.length };
  };

  const stats = getStatistics();

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Registro de Asistencia
        </Typography>
        
        {/* Statistics */}
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Chip
            icon={<PresentIcon />}
            label={`Presentes: ${stats.present}`}
            color="success"
            variant="outlined"
          />
          <Chip
            icon={<LateIcon />}
            label={`Tarde: ${stats.late}`}
            color="warning"
            variant="outlined"
          />
          <Chip
            icon={<AbsentIcon />}
            label={`Ausentes: ${stats.absent}`}
            color="error"
            variant="outlined"
          />
          <Chip
            label={`Total: ${stats.total}`}
            variant="outlined"
          />
        </Stack>
      </Box>

      {students.length === 0 ? (
        <Alert severity="info">
          No hay estudiantes inscritos en esta sesión
        </Alert>
      ) : isMobile ? (
        <>
          <Stack spacing={2}>
            {students.map((student, index) => {
              const record = attendanceRecords.find((r) => r.student_id === student.user_id);
              
              return (
                <Card key={student.user_id} variant="outlined">
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Estudiante #{index + 1}
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {student.name} {student.last_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {student.email}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight="medium" gutterBottom>
                        Estado de Asistencia
                      </Typography>
                      <ToggleButtonGroup
                        value={record?.attendance_status}
                        exclusive
                        onChange={(_e, value) => handleStatusChange(student.user_id, value)}
                        size="small"
                        fullWidth
                        orientation="vertical"
                      >
                        <ToggleButton value="PRESENT" color="success">
                          <PresentIcon sx={{ mr: 1 }} />
                          Presente
                        </ToggleButton>
                        <ToggleButton value="LATE" color="warning">
                          <LateIcon sx={{ mr: 1 }} />
                          Tarde
                        </ToggleButton>
                        <ToggleButton value="ABSENT" color="error">
                          <AbsentIcon sx={{ mr: 1 }} />
                          Ausente
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" fontWeight="medium" gutterBottom>
                        Notas
                      </Typography>
                      <TextField
                        size="small"
                        placeholder="Notas opcionales..."
                        value={record?.notes || ''}
                        onChange={(e) => handleNotesChange(student.user_id, e.target.value)}
                        fullWidth
                        multiline
                        rows={2}
                      />
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>

          {/* Save Button */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={
                saveMutation.isPending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SaveIcon />
                )
              }
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? 'Guardando...' : 'Guardar Asistencia'}
            </Button>
          </Box>
        </>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>#</strong></TableCell>
                  <TableCell><strong>Estudiante</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell align="center"><strong>Asistencia</strong></TableCell>
                  <TableCell><strong>Notas</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student, index) => {
                  const record = attendanceRecords.find((r) => r.student_id === student.user_id);
                  
                  return (
                    <TableRow key={student.user_id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {student.name} {student.last_name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {student.email}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <ToggleButtonGroup
                          value={record?.attendance_status}
                          exclusive
                          onChange={(_e, value) => handleStatusChange(student.user_id, value)}
                          size="small"
                        >
                          <ToggleButton value="PRESENT" color="success">
                            <PresentIcon sx={{ mr: 0.5 }} />
                            Presente
                          </ToggleButton>
                          <ToggleButton value="LATE" color="warning">
                            <LateIcon sx={{ mr: 0.5 }} />
                            Tarde
                          </ToggleButton>
                          <ToggleButton value="ABSENT" color="error">
                            <AbsentIcon sx={{ mr: 0.5 }} />
                            Ausente
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          placeholder="Notas opcionales..."
                          value={record?.notes || ''}
                          onChange={(e) => handleNotesChange(student.user_id, e.target.value)}
                          fullWidth
                          multiline
                          maxRows={2}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Save Button */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={
                saveMutation.isPending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SaveIcon />
                )
              }
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? 'Guardando...' : 'Guardar Asistencia'}
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
}

export default AttendanceForm;
