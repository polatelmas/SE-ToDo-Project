// Backend Enum/Lookup Table Mappings
// These mappings correspond to the lookup tables in the database

// ============= PRIORITY LEVEL MAPPINGS =============
export const PRIORITY_TO_ID = {
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3
} as const;

export const PRIORITY_ID_TO_STRING = {
  1: 'HIGH',
  2: 'MEDIUM',
  3: 'LOW'
} as const;

// For reverse lookups
export const getPriorityId = (priority: string): number => {
  const id = PRIORITY_TO_ID[priority as keyof typeof PRIORITY_TO_ID];
  if (id === undefined) {
    console.warn(`Unknown priority: ${priority}, defaulting to MEDIUM (2)`);
    return 2;
  }
  return id;
};

export const getPriorityString = (id: number): string => {
  const priority = PRIORITY_ID_TO_STRING[id as keyof typeof PRIORITY_ID_TO_STRING];
  if (!priority) {
    console.warn(`Unknown priority id: ${id}, defaulting to MEDIUM`);
    return 'MEDIUM';
  }
  return priority;
};

// ============= TASK STATUS MAPPINGS =============
export const STATUS_TO_ID = {
  PENDING: 1,
  COMPLETED: 2,
  CANCELLED: 3
} as const;

export const STATUS_ID_TO_STRING = {
  1: 'PENDING',
  2: 'COMPLETED',
  3: 'CANCELLED'
} as const;

export const getStatusId = (status: string): number => {
  const id = STATUS_TO_ID[status as keyof typeof STATUS_TO_ID];
  if (id === undefined) {
    console.warn(`Unknown status: ${status}, defaulting to PENDING (1)`);
    return 1;
  }
  return id;
};

export const getStatusString = (id: number): string => {
  const status = STATUS_ID_TO_STRING[id as keyof typeof STATUS_ID_TO_STRING];
  if (!status) {
    console.warn(`Unknown status id: ${id}, defaulting to PENDING`);
    return 'PENDING';
  }
  return status;
};

// ============= RECURRENCE TYPE MAPPINGS =============
export const RECURRENCE_TO_ID = {
  NONE: 1,
  DAILY: 2,
  WEEKLY: 3,
  WEEKDAYS: 4,
  WEEKENDS: 5,
  MONTHLY: 6,
  YEARLY: 7
} as const;

export const RECURRENCE_ID_TO_STRING = {
  1: 'NONE',
  2: 'DAILY',
  3: 'WEEKLY',
  4: 'WEEKDAYS',
  5: 'WEEKENDS',
  6: 'MONTHLY',
  7: 'YEARLY'
} as const;

export const getRecurrenceId = (recurrence: string | null): number => {
  if (!recurrence) return 1; // Default to NONE
  
  const id = RECURRENCE_TO_ID[recurrence as keyof typeof RECURRENCE_TO_ID];
  if (id === undefined) {
    console.warn(`Unknown recurrence type: ${recurrence}, defaulting to NONE (1)`);
    return 1;
  }
  return id;
};

export const getRecurrenceString = (id: number | null): string | null => {
  if (id === null || id === 1) return null; // Return null for NONE
  
  const recurrence = RECURRENCE_ID_TO_STRING[id as keyof typeof RECURRENCE_ID_TO_STRING];
  if (!recurrence) {
    console.warn(`Unknown recurrence id: ${id}, defaulting to NONE`);
    return null;
  }
  return recurrence;
};

// ============= TYPE DEFINITIONS =============
export type PriorityString = keyof typeof PRIORITY_TO_ID;
export type StatusString = keyof typeof STATUS_TO_ID;
export type RecurrenceString = keyof typeof RECURRENCE_TO_ID | null;

// ============= UTILITY FUNCTIONS =============

/**
 * Transform API response from database format (with IDs) to frontend format (with strings)
 * Used when receiving data from backend
 */
export const transformTaskFromAPI = (apiTask: any) => {
  return {
    ...apiTask,
    priority: getPriorityString(apiTask.priority_id),
    status: getStatusString(apiTask.status_id),
    recurrence_type: getRecurrenceString(apiTask.recurrence_type_id)
  };
};

/**
 * Transform frontend data to API format (with IDs) before sending to backend
 * Used when sending data to backend
 */
export const transformTaskToAPI = (frontendTask: any) => {
  const transformed = {
    ...frontendTask,
    priority_id: getPriorityId(frontendTask.priority || 'MEDIUM'),
    status_id: getStatusId(frontendTask.status || 'PENDING'),
    recurrence_type_id: getRecurrenceId(frontendTask.recurrence_type)
  };
  
  // Remove the string versions since API expects IDs
  delete transformed.priority;
  delete transformed.status;
  delete transformed.recurrence_type;
  
  return transformed;
};
