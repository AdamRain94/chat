package main;


import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserRepository extends CrudRepository<Users, Integer> {
  Optional<Users> findBySessionId(String sessionId);
  Optional<Users> findById(Integer id);
  Optional<Users> findByOnline(boolean online);
  long countByOnline(boolean online);
}
