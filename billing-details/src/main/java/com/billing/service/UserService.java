package com.billing.service;

import java.util.List;

import com.billing.dto.UserDto;

public interface UserService {

	public UserDto createUser(UserDto user);

	public UserDto getUserById(String userId);

	public UserDto getUserByUsername(String userName);

	public List<UserDto> getAllUsers();

	public UserDto updateUser(UserDto user);

	public void deleteUser(String userId);

}