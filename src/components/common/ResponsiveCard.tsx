/**
 * Responsive Card Component
 * School Advisories System
 * 
 * Generic card component for displaying data in mobile view
 * as an alternative to tables
 */

import { Card, CardContent, Box, Typography, Stack, Chip } from '@mui/material';
import type { ReactNode } from 'react';

/**
 * Chip configuration
 */
export interface ResponsiveCardChip {
  label: string;
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  variant?: 'filled' | 'outlined';
}

/**
 * Responsive Card Props
 */
interface ResponsiveCardProps {
  /** Main title */
  title: string;
  /** Subtitle or secondary text */
  subtitle?: string;
  /** Additional info line */
  info?: string;
  /** Array of chips to display */
  chips?: ResponsiveCardChip[];
  /** Action buttons or icons */
  actions?: ReactNode;
  /** Additional content */
  children?: ReactNode;
  /** Click handler */
  onClick?: () => void;
}

/**
 * Responsive Card Component
 * 
 * Used as alternative to table rows in mobile view
 * 
 * @example
 * <ResponsiveCard
 *   title="John Doe"
 *   subtitle="john@example.com"
 *   info="ID: 123"
 *   chips={[
 *     { label: 'Admin', color: 'primary' as const },
 *     { label: 'Activo', color: 'success' as const }
 *   ]}
 *   actions={
 *     <>
 *       <IconButton><EditIcon /></IconButton>
 *       <IconButton><DeleteIcon /></IconButton>
 *     </>
 *   }
 * />
 */
export function ResponsiveCard({
  title,
  subtitle,
  info,
  chips,
  actions,
  children,
  onClick,
}: ResponsiveCardProps) {
  return (
    <Card
      variant="outlined"
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick
          ? {
              bgcolor: 'action.hover',
              borderColor: 'primary.main',
            }
          : {},
        transition: 'all 0.2s',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
          {/* Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Title */}
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {title}
            </Typography>

            {/* Subtitle */}
            {subtitle && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {subtitle}
              </Typography>
            )}

            {/* Info */}
            {info && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {info}
              </Typography>
            )}

            {/* Chips */}
            {chips && chips.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
                {chips.map((chip, index) => (
                  <Chip
                    key={index}
                    label={chip.label}
                    color={chip.color || 'default'}
                    variant={chip.variant || 'filled'}
                    size="small"
                  />
                ))}
              </Stack>
            )}

            {/* Additional children */}
            {children && <Box sx={{ mt: 2 }}>{children}</Box>}
          </Box>

          {/* Actions */}
          {actions && (
            <Box
              sx={{
                display: 'flex',
                gap: 0.5,
                flexShrink: 0,
              }}
            >
              {actions}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default ResponsiveCard;
