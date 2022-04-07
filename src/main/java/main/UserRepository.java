package main;


import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends CrudRepository<Users, Integer> {
  Optional<Users> findBySessionId(String sessionId);
  Optional<Users> findById(Integer id);
  List<Users> findByOnline(boolean online);
}
