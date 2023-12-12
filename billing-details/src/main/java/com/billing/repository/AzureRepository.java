package com.billing.repository;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.billing.entity.Azure;

@EnableMongoRepositories
public interface AzureRepository extends MongoRepository<Azure, String> {

	List<Azure> findByusageDateBetween(LocalDate startDate, LocalDate endDate);
}
