package com.billing.entity;

import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "users-billing")
public class User {
	@Id
	private String id;

	@NotNull
	@NotBlank
	private String firstName;

	@NotNull
	@NotBlank
	private String lastName;

	@NotNull
	@NotBlank
    @Indexed(unique = true)
	private String userName;

	@NotNull
	@NotBlank
	@Indexed(unique = true)
	private String email;

	@NotNull
	@NotBlank
	private String password;
	
	@NotNull
	@NotBlank
	private String roles;
	
	private boolean isActive;
}