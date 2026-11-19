package com.hotel.management.service;

import com.hotel.management.entity.Room;
import com.hotel.management.exception.ResourceNotFoundException;
import com.hotel.management.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Room not found with id " + id));
    }

    public Room addRoom(Room room) {
        return roomRepository.save(room);
    }

    public Room updateRoom(Long id, Room updated) {
        Room room = getRoomById(id);
        room.setRoomNumber(updated.getRoomNumber());
        room.setType(updated.getType());
        room.setPricePerNight(updated.getPricePerNight());
        room.setStatus(updated.getStatus());
        return roomRepository.save(room);
    }

    public void deleteRoom(Long id) {
        roomRepository.delete(getRoomById(id));
    }
}