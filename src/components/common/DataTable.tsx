/**
 * Data Table Component
 * School Advisories System
 * 
 * Wrapper for MUI DataGrid with common configurations
 */

import { useState } from 'react';
import {
  DataGrid,
  GridToolbar,
} from '@mui/x-data-grid';
import type {
  GridColDef,
  GridRowsProp,
  GridPaginationModel,
  GridSortModel,
  GridFilterModel,
  GridRowSelectionModel,
  GridCallbackDetails,
} from '@mui/x-data-grid';
import { Box, Paper, Typography } from '@mui/material';

/**
 * Data Table Props
 */
export interface DataTableProps {
  /** Table rows data */
  rows: GridRowsProp;
  /** Column definitions */
  columns: GridColDef[];
  /** Loading state */
  loading?: boolean;
  /** Enable row selection */
  checkboxSelection?: boolean;
  /** Selected rows (controlled) */
  rowSelectionModel?: GridRowSelectionModel;
  /** Callback when selection changes */
  onRowSelectionModelChange?: (
    rowSelectionModel: GridRowSelectionModel,
    details: GridCallbackDetails
  ) => void;
  /** Enable pagination */
  pagination?: boolean;
  /** Current page (0-indexed) */
  page?: number;
  /** Rows per page */
  pageSize?: number;
  /** Total row count (for server-side pagination) */
  rowCount?: number;
  /** Callback when pagination changes */
  onPaginationModelChange?: (model: GridPaginationModel) => void;
  /** Sort model */
  sortModel?: GridSortModel;
  /** Callback when sort changes */
  onSortModelChange?: (model: GridSortModel) => void;
  /** Filter model */
  filterModel?: GridFilterModel;
  /** Callback when filter changes */
  onFilterModelChange?: (model: GridFilterModel) => void;
  /** Table height (default: 400) */
  height?: number | string;
  /** Show toolbar with export/filter */
  showToolbar?: boolean;
  /** Disable column menu */
  disableColumnMenu?: boolean;
  /** Disable column selector */
  disableColumnSelector?: boolean;
  /** Disable density selector */
  disableDensitySelector?: boolean;
  /** Empty state message */
  noRowsMessage?: string;
  /** Empty state during loading */
  loadingMessage?: string;
  /** Row height (default: 52) */
  rowHeight?: number;
  /** Auto height (grows with content) */
  autoHeight?: boolean;
  /** Disable virtualization (for small datasets) */
  disableVirtualization?: boolean;
}

/**
 * Data Table Component
 * 
 * Wrapper around MUI DataGrid with common settings and Spanish localization.
 * 
 * @example Basic usage
 * ```tsx
 * const columns: GridColDef[] = [
 *   { field: 'id', headerName: 'ID', width: 90 },
 *   { field: 'name', headerName: 'Nombre', width: 200 },
 *   { field: 'email', headerName: 'Email', width: 250 },
 * ];
 * 
 * const rows = [
 *   { id: 1, name: 'Juan', email: 'juan@example.com' },
 *   { id: 2, name: 'María', email: 'maria@example.com' },
 * ];
 * 
 * <DataTable rows={rows} columns={columns} />
 * ```
 * 
 * @example With pagination and selection
 * ```tsx
 * <DataTable
 *   rows={rows}
 *   columns={columns}
 *   checkboxSelection
 *   pagination
 *   pageSize={10}
 *   onRowSelectionModelChange={(newSelection) => {
 *     setSelectedRows(newSelection);
 *   }}
 * />
 * ```
 */
export function DataTable({
  rows,
  columns,
  loading = false,
  checkboxSelection = false,
  rowSelectionModel,
  onRowSelectionModelChange,
  pagination = true,
  page = 0,
  pageSize = 10,
  rowCount,
  onPaginationModelChange,
  sortModel,
  onSortModelChange,
  filterModel,
  onFilterModelChange,
  height = 400,
  showToolbar = false,
  disableColumnMenu = false,
  disableColumnSelector = false,
  disableDensitySelector = false,
  noRowsMessage = 'No hay datos disponibles',
  loadingMessage = 'Cargando...',
  rowHeight = 52,
  autoHeight = false,
  disableVirtualization = false,
}: DataTableProps) {
  // Local state for uncontrolled pagination
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page,
    pageSize,
  });

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    setPaginationModel(model);
    onPaginationModelChange?.(model);
  };

  return (
    <Paper
      sx={{
        height: autoHeight ? 'auto' : height,
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        checkboxSelection={checkboxSelection}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={onRowSelectionModelChange}
        {...(pagination && {
          paginationModel: onPaginationModelChange ? { page, pageSize } : paginationModel,
          onPaginationModelChange: handlePaginationModelChange,
          pageSizeOptions: [5, 10, 25, 50, 100],
        })}
        rowCount={rowCount}
        paginationMode={rowCount ? 'server' : 'client'}
        sortingMode={sortModel ? 'server' : 'client'}
        filterMode={filterModel ? 'server' : 'client'}
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        filterModel={filterModel}
        onFilterModelChange={onFilterModelChange}
        disableColumnMenu={disableColumnMenu}
        disableColumnSelector={disableColumnSelector}
        disableDensitySelector={disableDensitySelector}
        rowHeight={rowHeight}
        autoHeight={autoHeight}
        disableVirtualization={disableVirtualization}
        slots={{
          toolbar: showToolbar ? GridToolbar : undefined,
          noRowsOverlay: () => (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <Typography color="text.secondary">
                {loading ? loadingMessage : noRowsMessage}
              </Typography>
            </Box>
          ),
        }}
        sx={{
          border: 'none',
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'action.hover',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'background.default',
            borderBottom: 2,
            borderColor: 'divider',
          },
        }}
      />
    </Paper>
  );
}

export default DataTable;
