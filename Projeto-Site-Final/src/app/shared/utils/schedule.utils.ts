import { Agendamento, Bloqueio } from '../../core/models/types';
import { timeToMinutes } from './time.utils';

/**
 * Splits an ISO date-time string (e.g. "2026-09-10T09:00:00") into its
 * local date and time components.
 */
export function splitDateTime(dataHora: string): { date: string; time: string } {
  const [date, time = '00:00'] = dataHora.split('T');
  return { date, time: time.substring(0, 5) };
}

/**
 * Returns true when two half-open time ranges (in minutes since midnight)
 * overlap each other. Adjacent ranges (e.g. 09:00-10:00 and 10:00-11:00)
 * do not overlap because the end boundary is exclusive.
 */
export function rangesOverlap(
  startA: number,
  endA: number,
  startB: number,
  endB: number
): boolean {
  return !(endA <= startB || startA >= endB);
}

/**
 * Validates whether a candidate time slot is free to be booked.
 *
 * This is the single source of truth for availability, shared by the
 * availability listing and the appointment creation/rescheduling logic so
 * the UI and the service can never disagree about a slot.
 *
 * A slot is unavailable when it overlaps an active (non-cancelled)
 * appointment or a provider block for the same provider and date.
 *
 * @param appointments - All appointments, including cancelled ones (filtered here).
 * @param blocks - Provider blocks covering busy/unavailable periods.
 * @param prestadorId - Provider the slot belongs to.
 * @param dataHora - Candidate date-time in "YYYY-MM-DDTHH:mm:ss" form.
 * @param duracao - Candidate duration in minutes.
 * @param excludeId - Appointment id to ignore (used when rescheduling).
 */
export function isSlotAvailable(
  appointments: Agendamento[],
  blocks: Bloqueio[],
  prestadorId: string,
  dataHora: string,
  duracao: number,
  excludeId?: string
): boolean {
  const { date: candidateDate, time: candidateTime } = splitDateTime(dataHora);
  const candidateStart = timeToMinutes(candidateTime);
  const candidateEnd = candidateStart + duracao;

  const overlaps = (start: number, end: number): boolean =>
    rangesOverlap(candidateStart, candidateEnd, start, end);

  const isBlocked = blocks.some(block => {
    if (block.prestadorId !== prestadorId) return false;
    const { date: blockDate, time: blockTime } = splitDateTime(block.dataHora);
    if (blockDate !== candidateDate) return false;
    return overlaps(timeToMinutes(blockTime), timeToMinutes(blockTime) + block.duracao);
  });

  if (isBlocked) return false;

  const hasAppointmentConflict = appointments.some(appointment => {
    if (appointment.id === excludeId || appointment.prestadorId !== prestadorId) return false;
    if (appointment.status === 'cancelado') return false;
    const { date: appointmentDate, time: appointmentTime } = splitDateTime(appointment.dataHora);
    if (appointmentDate !== candidateDate) return false;
    return overlaps(
      timeToMinutes(appointmentTime),
      timeToMinutes(appointmentTime) + appointment.duracao
    );
  });

  return !hasAppointmentConflict;
}
