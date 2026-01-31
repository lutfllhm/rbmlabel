-- ============================================
-- RBM Combined Database
-- Menggabungkan 3 database: LPS, Material, dan Stok Label
-- ============================================

-- Create main database
CREATE DATABASE IF NOT EXISTS rbm_combined CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rbm_combined;

-- ============================================
-- SHARED TABLES
-- ============================================

-- Table: users (shared across all apps)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    role ENUM('admin', 'user') DEFAULT 'user',
    reset_token VARCHAR(255),
    reset_token_expiry DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default admin user (password: iware123)
INSERT INTO users (username, password, full_name, email, role) VALUES
('admin', '$2a$10$1FpPzTZ11zfjcV4lQEj3N.PU2hZH0nvLwITZ9yDyUiCs.XS2iyBGy', 'Administrator', 'admin@rbm.com', 'admin');

-- ============================================
-- LPS MODULE TABLES
-- ============================================

-- Table: lps
CREATE TABLE IF NOT EXISTS lps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tanggal DATE NOT NULL,
    no_lps VARCHAR(100) UNIQUE NOT NULL,
    papercore_pcs INT NOT NULL,
    papercore_size VARCHAR(10) NOT NULL,
    nama_item VARCHAR(200) NOT NULL,
    customer VARCHAR(100),
    part_number VARCHAR(100) NOT NULL,
    no_spk VARCHAR(100),
    po VARCHAR(100),
    jumlah_pcs BIGINT NOT NULL,
    material VARCHAR(100) NOT NULL,
    status ENUM('pending', 'finish') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: lps_label_finish
CREATE TABLE IF NOT EXISTS lps_label_finish (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lps_id INT NOT NULL,
    tanggal_finish DATE NOT NULL,
    verified_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lps_id) REFERENCES lps(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: lps_report
CREATE TABLE IF NOT EXISTS lps_report (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bulan INT NOT NULL,
    tahun INT NOT NULL,
    total_lps INT NOT NULL DEFAULT 0,
    total_finish INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_month_year (bulan, tahun)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- MATERIAL MODULE TABLES
-- ============================================

-- Table: material_categories
CREATE TABLE IF NOT EXISTS material_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default categories
INSERT INTO material_categories (name) VALUES
('YUPO/VYNIL'),
('DIRECT THERMAL COATED'),
('DIRECT THERMAL NON COATED'),
('HVS SEMICOATED'),
('HVS FULL COATED'),
('HVS SEMICOAT BLUE'),
('HVS SEMICOAT REMOVEABLE');

-- Table: material_stock
CREATE TABLE IF NOT EXISTS material_stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    no_po VARCHAR(50) NOT NULL,
    tanggal DATE NOT NULL,
    nama_material VARCHAR(200) NOT NULL,
    ukuran VARCHAR(50) NOT NULL,
    kategori_id INT NOT NULL,
    supplier VARCHAR(100) NOT NULL,
    jumlah_roll DECIMAL(10,2) NOT NULL,
    jumlah_meter DECIMAL(10,2) GENERATED ALWAYS AS (jumlah_roll * 1000) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (kategori_id) REFERENCES material_categories(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: material_label_list
CREATE TABLE IF NOT EXISTS material_label_list (
    id INT AUTO_INCREMENT PRIMARY KEY,
    part_number VARCHAR(100) UNIQUE NOT NULL,
    nama_item VARCHAR(200) NOT NULL,
    ukuran VARCHAR(50) NOT NULL,
    finishing VARCHAR(50) NOT NULL,
    isi INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: material_spk
CREATE TABLE IF NOT EXISTS material_spk (
    id INT AUTO_INCREMENT PRIMARY KEY,
    no_spk VARCHAR(100) UNIQUE NOT NULL,
    label_id INT NULL,
    part_number VARCHAR(100),
    nama_item VARCHAR(200),
    ukuran VARCHAR(50),
    finishing VARCHAR(50),
    isi INT,
    warna VARCHAR(50),
    customer VARCHAR(100) DEFAULT NULL,
    jumlah_order_pcs INT NOT NULL,
    jumlah_order_roll DECIMAL(10,2),
    jumlah_cetak_pcs INT NOT NULL,
    jumlah_kebutuhan VARCHAR(100),
    diameter_core VARCHAR(10),
    material_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (label_id) REFERENCES material_label_list(id) ON DELETE SET NULL,
    FOREIGN KEY (material_id) REFERENCES material_stock(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: material_report
CREATE TABLE IF NOT EXISTS material_report (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bulan INT NOT NULL,
    tahun INT NOT NULL,
    kategori_id INT NOT NULL,
    total_roll DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_meter DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kategori_id) REFERENCES material_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- STOK LABEL MODULE TABLES
-- ============================================

-- Table: stok_label
CREATE TABLE IF NOT EXISTS stok_label (
    id INT AUTO_INCREMENT PRIMARY KEY,
    part_number VARCHAR(100) UNIQUE NOT NULL,
    nama_item VARCHAR(200) NOT NULL,
    ukuran VARCHAR(50) NOT NULL,
    finishing VARCHAR(50) NOT NULL,
    isi INT NOT NULL,
    jumlah_roll DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: stok_label_masuk
CREATE TABLE IF NOT EXISTS stok_label_masuk (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tanggal DATE NOT NULL,
    no_spk VARCHAR(100) NOT NULL,
    no_lps VARCHAR(100),
    part_number VARCHAR(100) NOT NULL,
    nama_item VARCHAR(200) NOT NULL,
    jumlah_order VARCHAR(100) NOT NULL,
    customer VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: stok_label_keluar
CREATE TABLE IF NOT EXISTS stok_label_keluar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tanggal DATE NOT NULL,
    part_number VARCHAR(100) NOT NULL,
    nama_item VARCHAR(200) NOT NULL,
    customer VARCHAR(100),
    jumlah VARCHAR(100) NOT NULL,
    keterangan VARCHAR(200),
    surat_jalan_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: stok_surat_jalan
CREATE TABLE IF NOT EXISTS stok_surat_jalan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    no_delivery VARCHAR(100) UNIQUE NOT NULL,
    customer VARCHAR(100) NOT NULL,
    tanggal DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: stok_surat_jalan_items
CREATE TABLE IF NOT EXISTS stok_surat_jalan_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    surat_jalan_id INT NOT NULL,
    label_keluar_id INT NOT NULL,
    part_number VARCHAR(100) NOT NULL,
    nama_item VARCHAR(200) NOT NULL,
    jumlah VARCHAR(100) NOT NULL,
    FOREIGN KEY (surat_jalan_id) REFERENCES stok_surat_jalan(id) ON DELETE CASCADE,
    FOREIGN KEY (label_keluar_id) REFERENCES stok_label_keluar(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: stok_report
CREATE TABLE IF NOT EXISTS stok_report (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bulan INT NOT NULL,
    tahun INT NOT NULL,
    total_masuk INT NOT NULL DEFAULT 0,
    total_keluar INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- END OF COMBINED DATABASE SCHEMA
-- ============================================
