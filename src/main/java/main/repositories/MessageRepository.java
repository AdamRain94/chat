package main.repositories;

import main.model.Message;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface MessageRepository extends CrudRepository<Message, Integer> {
    List<Message> findFirst30ByOrderByDateTimeDesc();
}
