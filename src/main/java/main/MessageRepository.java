package main;

import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface MessageRepository extends CrudRepository<Message, Integer> {
    Optional <Message> findById(int id);
    List<Message> findFirst30ByOrderByDateTimeDesc();
}
