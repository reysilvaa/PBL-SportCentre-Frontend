// Import secara langsung untuk fungsi yang akan digunakan di dalam file
import { 
  initSocket, 
  initFieldsSocket,
  initNotificationSocket,
} from '@/config/socket.config';

// Export dari file konfigurasi socket
export { 
  initSocket, 
  getSocket, 
  disconnectSocket,
  joinRoom,
  leaveRoom,
  // Tambahkan ekspor fungsi fields socket
  initFieldsSocket,
  getFieldsSocket,
  joinFieldsRoom,
  leaveFieldsRoom,
  // Tambahkan ekspor fungsi notification socket
  initNotificationSocket,
  getNotificationSocket
} from '@/config/socket.config';

// Export dari modul ketersediaan lapangan
export {
  joinFieldAvailabilityRoom,
  joinFieldRoom,
  requestAvailabilityUpdate,
  subscribeToFieldAvailability,
  subscribeToFieldAvailabilityChanges,
} from './field-availability.socket';

// Export dari modul notifikasi
export {
  joinNotificationRoom,
  subscribeToNotifications,
  subscribeToNotificationUpdates,
} from './notification.socket';

// Export dari modul booking
export {
  subscribeToBookingUpdates,
  subscribeToBookingCancellations,
  joinBookingRoom,
  joinUserBookingRoom,
} from './booking.socket';

// Export default untuk backward compatibility
import fieldAvailability from './field-availability.socket';
import notification from './notification.socket';
import booking from './booking.socket';

// Inisialisasi socket function untuk ekspor
export const initializeSockets = () => {
  try {
    const rootSocket = initSocket();
    const fieldsSocket = initFieldsSocket();
    const notificationSocket = initNotificationSocket();
    
    return { rootSocket, fieldsSocket, notificationSocket };
  } catch (error) {
    return { rootSocket: null, fieldsSocket: null, notificationSocket: null };
  }
};

export default {
  fieldAvailability,
  notification,
  booking,
  initializeSockets
}; 