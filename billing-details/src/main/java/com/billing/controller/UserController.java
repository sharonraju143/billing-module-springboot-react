package com.billing.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.billing.dto.UserDto;
import com.billing.entity.LoginRequest;
import com.billing.exception.UsernameAlreadyExistsException;
import com.billing.service.UserService;
import com.billing.util.JwtUtil;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/users")
public class UserController {

	@Autowired
	private UserService userService;

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private AuthenticationManager authenticationManager;

	@PostMapping("/saveuser")
	public ResponseEntity<?> createUser(@RequestBody UserDto user) {
		try {
			// Attempt to create a user
			UserDto savedUser = userService.createUser(user);
			return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
		} catch (UsernameAlreadyExistsException e) {
			// Username already exists - handle this exception
			return new ResponseEntity<>("Username already exists", HttpStatus.CONFLICT);
		} catch (Exception e) {
			// Other unexpected exceptions
			return new ResponseEntity<>("Failed to create user", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/getallusers")
	@PreAuthorize("hasAuthority('ROLE_ADMIN')")
	public ResponseEntity<List<UserDto>> getAllUsers() {
		List<UserDto> users = userService.getAllUsers();
		return new ResponseEntity<>(users, HttpStatus.OK);
	}

	@GetMapping("/getuserbyid/{id}")
	@PreAuthorize("hasAuthority('ROLE_USER')")
	public ResponseEntity<UserDto> getUserById(@PathVariable("id") String userId) {
		UserDto user = userService.getUserById(userId);
		return new ResponseEntity<>(user, HttpStatus.OK);
	}

	@GetMapping("/getuserbyname/{username}")
	@PreAuthorize("hasAuthority('ROLE_USER')")
	public ResponseEntity<UserDto> getUserByUsername(@PathVariable("username") String userName) {
		UserDto user = userService.getUserByUsername(userName);
		return new ResponseEntity<>(user, HttpStatus.OK);
	}

	@PutMapping("/updateuser/{id}")
	@PreAuthorize("hasAuthority('ROLE_USER')")
	public ResponseEntity<UserDto> updateUser(@PathVariable("id") String userId, @RequestBody UserDto user) {
		user.setId(userId);
		UserDto updatedUser = userService.updateUser(user);
		return new ResponseEntity<>(updatedUser, HttpStatus.OK);
	}

	@DeleteMapping("/deleteuser/{id}")
	@PreAuthorize("hasAuthority('ROLE_USER')")
	public ResponseEntity<String> deleteUser(@PathVariable("id") String userId) {
		userService.deleteUser(userId);
		return new ResponseEntity<>("User successfully deleted", HttpStatus.OK);
	}

	@PostMapping("/authenticate")
	public String authenticateAndGetToken(@RequestBody LoginRequest loginRequest) {
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getUserName(), loginRequest.getPassword()));
		if (authentication.isAuthenticated()) {
			String res = jwtUtil.generateToken(loginRequest.getUserName());
			String result = "{\"token\":\"" + res + "\"}";
			return result;
		} else {
			throw new UsernameNotFoundException("Invalid username or password");
		}

	}
}