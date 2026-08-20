CREATE TABLE IF NOT EXISTS teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    organisation_id INT NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_org_team (organisation_id),
    INDEX idx_team_created_by (created_by)
);

CREATE TABLE IF NOT EXISTS team_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL,
    user_id INT NOT NULL,
    role ENUM('owner', 'admin', 'member') NOT NULL DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_team_member (team_id, user_id),
    INDEX idx_team_members_team (team_id),
    INDEX idx_team_members_user (user_id)
);

CREATE TABLE IF NOT EXISTS team_invitations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    invited_by INT NOT NULL,
    status ENUM('pending', 'accepted', 'declined', 'expired') NOT NULL DEFAULT 'pending',
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_team_invites_team (team_id),
    INDEX idx_team_invites_email (email)
);

ALTER TABLE bugs
    ADD COLUMN team_id INT NULL AFTER organisation_id;

ALTER TABLE bugs
    ADD CONSTRAINT fk_bugs_team
    FOREIGN KEY (team_id) REFERENCES teams(id)
    ON DELETE SET NULL;
