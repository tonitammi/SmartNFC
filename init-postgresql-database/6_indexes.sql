-- Content entry indexes
CREATE INDEX idx_content_entry_organization
ON content_entries(org_id);

CREATE INDEX idx_content_entry_organization_and_title
ON content_entries(org_id, title);

-- NFC-tag indexes
CREATE INDEX idx_nfc_tag_organization_and_address
ON nfc_tags(org_id, address);

CREATE INDEX idx_nfc_tag_organization_and_floor
ON nfc_tags(org_id, floor);

CREATE INDEX idx_nfc_tag_organization_and_room
ON nfc_tags(org_id, room);