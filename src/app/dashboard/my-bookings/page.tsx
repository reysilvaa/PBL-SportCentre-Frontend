"use client";

import { bookingApi } from "@/api";
import { useAuth } from "@/context/auth/auth.context";
import useGlobalLoading from "@/hooks/useGlobalLoading.hook";
import { PaymentStatus, BookingWithPayment } from "@/types";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import useToastHandler from "@/hooks/useToastHandler";
import Link from "next/link";
import { PaymentStatusBadge } from "@/components/ui/payment-status-badge";
import { getPaymentStatusText } from "@/utils/payment/paymentStatus.utils";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<BookingWithPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | "all">("all");
  const { user } = useAuth();
  const userId = user?.id || 0;
  const { showLoading, hideLoading, withLoading } = useGlobalLoading();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems] = useState(0);
  const maxData = 10;
  const { showError } = useToastHandler();

  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [isLoading, showLoading, hideLoading]);

  useEffect(() => {
    fetchBookings(statusFilter === "all" ? undefined : statusFilter);
  }, [currentPage, statusFilter]);

  const fetchBookings = async (status?: string) => {
    setIsLoading(true);
    try {
      const response = await withLoading(bookingApi.getUserBookings(userId, status));

      setBookings(Array.isArray(response) ? response : []);
    } catch (error) {
      showError(error, 'Gagal memuat data booking. Silakan coba lagi nanti.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as PaymentStatus | "all";
    setStatusFilter(status);
  }


  const paymentStatusOptions = Object.entries(PaymentStatus).map(([, value]) => ({
    label: getPaymentStatusText(value),
    value: value,
  }));

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Booking Saya</h1>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={handleFilterChange}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="all">Semua Status</option>
            {paymentStatusOptions.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Histori Booking</CardTitle>
            </div>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery
                ? "Tidak ada booking yang sesuai dengan pencarian"
                : "Anda belum memiliki booking."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Tanggal Peminjaman</TableHead>
                  <TableHead>Status Pembayaran</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking, index) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      {(currentPage - 1) * maxData + index + 1}
                    </TableCell>
                    <TableCell>{booking.field?.name}</TableCell>
                    <TableCell>{booking.field?.branch?.location}</TableCell>
                    <TableCell>
                      {format(new Date(booking.bookingDate), "dd MMMM yyyy", {
                        locale: id,
                      })}
                    </TableCell>
                    <TableCell>
                      <PaymentStatusBadge
                        status={booking.payment?.status}
                        payments={booking.payments}
                        totalPrice={booking.payment?.amount}
                        variant="default"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link
                          href={`/dashboard/my-bookings/${booking.id}`}
                          className="flex items-center px-3 py-1 text-sm font-medium border rounded hover:bg-muted"
                        >
                          Detail
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>
                {totalItems > maxData && (
                  <div className="flex justify-between items-center gap-4 mt-8">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                    >
                      Sebelumnya
                    </Button>
                    <span className="text-sm text-gray-500">
                      Halaman {currentPage} dari{" "}
                      {Math.ceil(totalItems / maxData)}
                    </span>
                    <Button
                      variant="outline"
                      disabled={currentPage >= Math.ceil(totalItems / maxData)}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                      Selanjutnya
                    </Button>
                  </div>
                )}
              </TableCaption>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
