CREATE TABLE IF NOT EXISTS expediciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  price INT DEFAULT NULL,
  image VARCHAR(500),
  gallery TEXT,
  activo TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS horarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  expedicion_id INT NOT NULL,
  dias VARCHAR(100) NOT NULL,
  hora_salida VARCHAR(5) NOT NULL,
  hora_regreso VARCHAR(5) NOT NULL,
  cupos INT DEFAULT 6,
  activo TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (expedicion_id) REFERENCES expediciones(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS contacto (
  clave VARCHAR(100) PRIMARY KEY,
  valor VARCHAR(500) NOT NULL
);

-- Seed contacto
INSERT IGNORE INTO contacto (clave, valor) VALUES
  ('telefono', '+5491140765354'),
  ('email', 'expediciones@jonco.com.ar'),
  ('instagram', 'joncoexperience'),
  ('whatsapp_mensaje', 'Hola Jon! Quiero consultar por una expedición.');

-- Seed expediciones — datos reales de Jonco
INSERT IGNORE INTO expediciones (id, title, category, description, price, image, gallery, activo) VALUES
(
  1,
  'Experiencia Delta Premium',
  'Exclusivo',
  'Navegación exclusiva por los canales más profundos del Delta. Una ruta que diseñé para quienes buscan entender el río desde la exclusividad absoluta.',
  85000,
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200',
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200, https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200, https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200',
  1
),
(
  2,
  'Río y Kayak',
  'Aventura',
  'Conectá con la naturaleza mientras remás hacia la puesta del sol. Una travesía por los rincones donde el agua y el cielo se vuelven uno solo.',
  32000,
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200, https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200, https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200',
  1
);

-- Seed horarios
INSERT IGNORE INTO horarios (expedicion_id, dias, hora_salida, hora_regreso, cupos, activo) VALUES
(1, 'Lun, Mar, Mié, Jue, Vie, Sáb, Dom', '09:00', '17:00', 6, 1),
(2, 'Sáb, Dom', '15:00', '18:30', 4, 1);
