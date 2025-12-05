-- CivicConnect database schema with all core tables

-- Users table with role-based access
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'citizen',
  phone VARCHAR(20),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  verification_token_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Officials table
CREATE TABLE IF NOT EXISTS officials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  position VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  bio TEXT,
  profile_image_url VARCHAR(255),
  performance_score DECIMAL(5, 2) DEFAULT 0,
  responsiveness_rate DECIMAL(5, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tickets (Citizen Issues) table
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_official_id UUID REFERENCES officials(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'open',
  priority VARCHAR(50) DEFAULT 'medium',
  location VARCHAR(255),
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ticket updates/comments table
CREATE TABLE IF NOT EXISTS ticket_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Official evaluations/ratings
CREATE TABLE IF NOT EXISTS evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  official_id UUID NOT NULL REFERENCES officials(id) ON DELETE CASCADE,
  citizen_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  category VARCHAR(100),
  comment TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(official_id, citizen_id, category)
);

-- Verified votes/feedback table
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  official_id UUID NOT NULL REFERENCES officials(id) ON DELETE CASCADE,
  vote_type VARCHAR(50) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(voter_id, official_id)
);

-- Performance metrics/KPIs for officials
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  official_id UUID NOT NULL REFERENCES officials(id) ON DELETE CASCADE,
  metric_name VARCHAR(255) NOT NULL,
  metric_value DECIMAL(10, 2) NOT NULL,
  metric_period VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Project tracking
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  official_id UUID NOT NULL REFERENCES officials(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  budget DECIMAL(15, 2),
  status VARCHAR(50) DEFAULT 'planned',
  progress_percentage INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Audit logs for transparency
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(255) NOT NULL,
  resource_type VARCHAR(100) NOT NULL,
  resource_id UUID,
  changes JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Budget allocation tracking
CREATE TABLE IF NOT EXISTS budget_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  official_id UUID NOT NULL REFERENCES officials(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  allocated_amount DECIMAL(15, 2) NOT NULL,
  spent_amount DECIMAL(15, 2) DEFAULT 0,
  fiscal_year INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_officials_user_id ON officials(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_citizen_id ON tickets(citizen_id);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned_official_id ON tickets(assigned_official_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_evaluations_official_id ON evaluations(official_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_citizen_id ON evaluations(citizen_id);
CREATE INDEX IF NOT EXISTS idx_votes_official_id ON votes(official_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_projects_official_id ON projects(official_id);
