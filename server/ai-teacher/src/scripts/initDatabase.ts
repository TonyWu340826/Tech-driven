import pool from '../config/database';

const createTables = async () => {
  const connection = await pool.getConnection();

  try {
    console.log('🔧 Starting database initialization...');

    // Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS l_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        avatar VARCHAR(500),
        phone VARCHAR(50),
        bio TEXT,
        role ENUM('student', 'tutor', 'admin') DEFAULT 'student',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Users table created');

    // Tutors table (extended profile for tutors)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS l_tutors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        price_per_hour DECIMAL(10, 2) NOT NULL,
        rating DECIMAL(3, 2) DEFAULT 0.00,
        review_count INT DEFAULT 0,
        verified BOOLEAN DEFAULT FALSE,
        subject VARCHAR(100),
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES l_users(id) ON DELETE CASCADE,
        INDEX idx_subject (subject),
        INDEX idx_rating (rating)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tutors table created');

    // Tutor tags table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS l_tutor_tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tutor_id INT NOT NULL,
        tag VARCHAR(100) NOT NULL,
        FOREIGN KEY (tutor_id) REFERENCES l_tutors(id) ON DELETE CASCADE,
        INDEX idx_tutor_tag (tutor_id, tag)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tutor tags table created');

    // Certifications table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS l_certifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tutor_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        issuer VARCHAR(255) NOT NULL,
        icon VARCHAR(100),
        color_class VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tutor_id) REFERENCES l_tutors(id) ON DELETE CASCADE,
        INDEX idx_tutor_cert (tutor_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Certifications table created');

    // Reviews table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS l_reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tutor_id INT NOT NULL,
        user_id INT NOT NULL,
        rating DECIMAL(2, 1) NOT NULL,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (tutor_id) REFERENCES l_tutors(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES l_users(id) ON DELETE CASCADE,
        INDEX idx_tutor_review (tutor_id),
        INDEX idx_user_review (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Reviews table created');

    // Bookings/Schedule table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS l_bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        tutor_id INT NOT NULL,
        subject VARCHAR(255) NOT NULL,
        status ENUM('upcoming', 'completed', 'canceled') DEFAULT 'upcoming',
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        type ENUM('online', 'in-person') DEFAULT 'online',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES l_users(id) ON DELETE CASCADE,
        FOREIGN KEY (tutor_id) REFERENCES l_tutors(id) ON DELETE CASCADE,
        INDEX idx_student_booking (student_id),
        INDEX idx_tutor_booking (tutor_id),
        INDEX idx_status (status),
        INDEX idx_start_time (start_time)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Bookings table created');

    // Conversations table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS l_conversations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        tutor_id INT NOT NULL,
        last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES l_users(id) ON DELETE CASCADE,
        FOREIGN KEY (tutor_id) REFERENCES l_tutors(id) ON DELETE CASCADE,
        UNIQUE KEY unique_conversation (student_id, tutor_id),
        INDEX idx_last_message (last_message_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Conversations table created');

    // Messages table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS l_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        conversation_id INT NOT NULL,
        sender_id INT NOT NULL,
        message_text TEXT NOT NULL,
        message_type ENUM('text', 'image') DEFAULT 'text',
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES l_conversations(id) ON DELETE CASCADE,
        FOREIGN KEY (sender_id) REFERENCES l_users(id) ON DELETE CASCADE,
        INDEX idx_conversation_msg (conversation_id),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Messages table created');

    // Favorites table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS l_favorites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        tutor_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES l_users(id) ON DELETE CASCADE,
        FOREIGN KEY (tutor_id) REFERENCES l_tutors(id) ON DELETE CASCADE,
        UNIQUE KEY unique_favorite (user_id, tutor_id),
        INDEX idx_user_favorite (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Favorites table created');

    console.log('✨ Database initialization completed successfully!');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  } finally {
    connection.release();
  }
};

// Run initialization
createTables()
  .then(() => {
    console.log('👍 All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });
