//package com.billing.config;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class CrosConfig implements WebMvcConfigurer {
//
//	@Override
//  public void addCorsMappings(CorsRegistry registry) {
//      registry.addMapping("/**") // Allow CORS for all endpoints
//              .allowedOrigins("http://localhost:3000") // Allow requests from this origin
//              .allowedMethods("GET", "POST", "PUT", "DELETE") // Allowed HTTP methods
//              .allowCredentials(true); // Allow sending cookies or authentication headers
//  }
//}
