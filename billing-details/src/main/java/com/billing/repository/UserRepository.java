package com.billing.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.billing.entity.User;

@EnableMongoRepositories
public interface UserRepository extends MongoRepository<User, String> {

	Optional<User> findByUserName(String userName);

	boolean existsByUserName(String userName);
}
