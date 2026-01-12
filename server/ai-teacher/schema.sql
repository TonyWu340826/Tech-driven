/* 1. users table */
CREATE TABLE IF NOT EXISTS l_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(500),
  phone VARCHAR(50),
  bio TEXT,
  role ENUM('student', 'tutor', 'admin') DEFAULT 'student',
  gender ENUM('male', 'female', 'other') DEFAULT 'male',
  balance DECIMAL(18,2) NOT NULL DEFAULT 0.00 COMMENT '钱包余额',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* 2. tutors table */
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* 3. tutor_tags table */
CREATE TABLE IF NOT EXISTS l_tutor_tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tutor_id INT NOT NULL,
  tag VARCHAR(100) NOT NULL,
  FOREIGN KEY (tutor_id) REFERENCES l_tutors(id) ON DELETE CASCADE,
  INDEX idx_tutor_tag (tutor_id, tag)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* 4. certifications table */
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* 5. reviews table */
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* 6. bookings table */
CREATE TABLE IF NOT EXISTS l_bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  tutor_id INT NOT NULL,
  subject VARCHAR(255) NOT NULL,
  status ENUM('pending', 'approved', 'completed', 'canceled') DEFAULT 'pending',
  payment_status ENUM('unpaid', 'paid') DEFAULT 'unpaid',
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  type ENUM('online', 'in-person') DEFAULT 'online',
  address VARCHAR(500),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES l_users(id) ON DELETE CASCADE,
  FOREIGN KEY (tutor_id) REFERENCES l_tutors(id) ON DELETE CASCADE,
  INDEX idx_student_booking (student_id),
  INDEX idx_tutor_booking (tutor_id),
  INDEX idx_status (status),
  INDEX idx_payment_status (payment_status),
  INDEX idx_start_time (start_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* 7. conversations table */
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* 8. messages table */
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* 9. favorites table */
CREATE TABLE IF NOT EXISTS l_favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  tutor_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES l_users(id) ON DELETE CASCADE,
  FOREIGN KEY (tutor_id) REFERENCES l_tutors(id) ON DELETE CASCADE,
  UNIQUE KEY unique_favorite (user_id, tutor_id),
  INDEX idx_user_favorite (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* 10. account_log table */
CREATE TABLE IF NOT EXISTS l_account_log (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL COMMENT '用户ID',
  change_amount DECIMAL(18,2) NOT NULL COMMENT '变动金额（正加负减）',
  before_balance DECIMAL(18,2) NOT NULL COMMENT '变动前余额',
  after_balance DECIMAL(18,2) NOT NULL COMMENT '变动后余额',
  biz_type VARCHAR(50) NOT NULL COMMENT '业务类型',
  biz_id VARCHAR(100) DEFAULT NULL COMMENT '业务单号',
  remark VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES l_users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_biz (biz_type, biz_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='钱包余额流水表';
