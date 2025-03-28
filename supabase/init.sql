-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY, -- wallet address
  x_user_id TEXT,
  x_access_token TEXT,
  x_refresh_token TEXT,
  x_screen_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  has_nft BOOLEAN DEFAULT FALSE,
  deployed_agent_ca TEXT,
  deployed_agent_mint TEXT,
  deployed_agent_tx TEXT,
  minted_on TIMESTAMP WITH TIME ZONE,
  UNIQUE(x_user_id)
);

-- Generated content table
CREATE TABLE generated_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT REFERENCES users(id),
  type TEXT CHECK (type IN ('text', 'image', 'video')),
  prompt TEXT NOT NULL,
  result_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  posted_to_x BOOLEAN DEFAULT FALSE
);

-- Analytics logs table
CREATE TABLE analytics_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT REFERENCES users(id),
  x_handle TEXT,
  action TEXT CHECK (action IN ('trend_view', 'content_posted', 'engagement_tracked')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Chat sessions table
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT REFERENCES users(id),
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Chat messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender TEXT CHECK (sender IN ('user', 'agent')),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_x_user_id ON users(x_user_id);
CREATE INDEX idx_generated_content_user_id ON generated_content(user_id);
CREATE INDEX idx_analytics_logs_user_id ON analytics_logs(user_id);
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);

-- Create RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read their own data"
  ON users FOR SELECT
  USING (auth.uid()::text = id);

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid()::text = id);

-- Generated content policies
CREATE POLICY "Users can read their own content"
  ON generated_content FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create their own content"
  ON generated_content FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Analytics logs policies
CREATE POLICY "Users can read their own analytics"
  ON analytics_logs FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create their own analytics"
  ON analytics_logs FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Chat sessions policies
CREATE POLICY "Users can read their own chat sessions"
  ON chat_sessions FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create their own chat sessions"
  ON chat_sessions FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Chat messages policies
CREATE POLICY "Users can read messages from their sessions"
  ON chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE id = chat_messages.session_id
      AND user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can create messages in their sessions"
  ON chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE id = chat_messages.session_id
      AND user_id = auth.uid()::text
    )
  ); 