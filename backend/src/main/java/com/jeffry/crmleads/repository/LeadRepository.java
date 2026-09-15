package com.jeffry.crmleads.repository;

import com.jeffry.crmleads.model.Lead;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeadRepository extends JpaRepository<Lead, Long> {

    List<Lead> findAllByOrderByCriadoEmDesc();
}