package com.hotel.management.service;

import com.hotel.management.dto.BookingRequest;
import com.hotel.management.entity.Booking;
import com.hotel.management.entity.Customer;
import com.hotel.management.entity.Room;
import com.hotel.management.enums.BookingStatus;
import com.hotel.management.enums.RoomStatus;
import com.hotel.management.exception.BadRequestException;
import com.hotel.management.exception.ConflictException;
import com.hotel.management.exception.ResourceNotFoundException;
import com.hotel.management.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CustomerService customerService;
    private final RoomService roomService;

    public BookingService(BookingRepository bookingRepository,
                          CustomerService customerService,
                          RoomService roomService) {
        this.bookingRepository = bookingRepository;
        this.customerService = customerService;
        this.roomService = roomService;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id " + id));
    }

    public Booking createBooking(BookingRequest request) {
        if (!request.checkOutDate().isAfter(request.checkInDate())) {
            throw new BadRequestException("Check-out date must be after check-in date");
        }

        Customer customer = customerService.getCustomerById(request.customerId());
        Room room = roomService.getRoomById(request.roomId());

        if (room.getStatus() == RoomStatus.MAINTENANCE) {
            throw new BadRequestException("Room " + room.getRoomNumber() + " is under maintenance");
        }

        long clashes = bookingRepository.countOverlapping(
            room.getId(), request.checkInDate(), request.checkOutDate());
        if (clashes > 0) {
            throw new ConflictException("Room " + room.getRoomNumber() + " is already booked for these dates");
        }

        long nights = ChronoUnit.DAYS.between(request.checkInDate(), request.checkOutDate());

        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setRoom(room);
        booking.setCheckInDate(request.checkInDate());
        booking.setCheckOutDate(request.checkOutDate());
        booking.setTotalAmount(room.getPricePerNight().multiply(BigDecimal.valueOf(nights)));
        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(Long id) {
        Booking booking = getBookingById(id);
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }
}