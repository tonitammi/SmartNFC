## Table `content_entries`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `org_id` | `uuid` |  Nullable |
| `title` | `text` |  Nullable |
| `content_data` | `jsonb` |  |
| `required_role` | `text` |  |
| `is_shared` | `bool` |  Nullable |
| `created_by` | `uuid` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |
| `folder_id` | `uuid` |  Nullable |
| `status` | `text` |  |

## Table `content_folders`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `org_id` | `uuid` |  Nullable |
| `parent_id` | `uuid` |  Nullable |
| `name` | `text` |  |
| `description` | `text` |  Nullable |
| `required_role` | `text` |  |
| `created_by` | `uuid` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |

## Table `dynamic_tag_groups`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `org_id` | `uuid` |  Nullable |
| `created_by` | `uuid` |  Nullable |
| `label` | `text` |  |
| `description` | `text` |  Nullable |
| `filters` | `jsonb` |  |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |

## Table `nfc_scan_logs`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `nfc_tag_id` | `text` |  Nullable |
| `scanned_at` | `timestamptz` |  Nullable |
| `scan_details` | `jsonb` |  Nullable |
| `org_id` | `uuid` |  Nullable |

## Table `organization_invitations`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `org_id` | `uuid` |  |
| `email` | `text` |  |
| `role` | `text` |  |
| `invited_by` | `uuid` |  Nullable |
| `inviter_email` | `text` |  |
| `status` | `text` |  |
| `token` | `uuid` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `expires_at` | `timestamptz` |  Nullable |

## Table `organization_users`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `org_id` | `uuid` |  Nullable |
| `user_id` | `uuid` |  Nullable |
| `role` | `text` |  |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |
| `email` | `text` |  |

## Table `organizations`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `name` | `text` |  Unique |
| `owner_id` | `uuid` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |
| `display_name` | `text` |  Nullable |

## Table `tag_categories`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `org_id` | `uuid` |  Nullable |
| `created_by` | `uuid` |  Nullable |
| `name` | `text` |  |

## Table `tag_content_assignments`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `tag_id` | `uuid` | Primary |
| `content_id` | `uuid` | Primary |

## Table `tag_folders`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `org_id` | `uuid` |  Nullable |
| `parent_id` | `uuid` |  Nullable |
| `name` | `text` |  |
| `description` | `text` |  Nullable |
| `required_role` | `text` |  |
| `created_by` | `uuid` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |

## Table `tag_group_tags`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `tag_id` | `uuid` | Primary |
| `tag_group_id` | `uuid` | Primary |

## Table `tag_groups`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `org_id` | `uuid` |  Nullable |
| `created_by` | `uuid` |  Nullable |
| `label` | `text` |  Unique |
| `description` | `text` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |

## Table `tag_keywords`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `org_id` | `uuid` |  Nullable |
| `created_by` | `uuid` |  Nullable |
| `name` | `text` |  |

## Table `tag_nfc_tags`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `nfc_tag_id` | `text` | Primary |
| `tag_id` | `uuid` |  |
| `org_id` | `uuid` |  |
| `created_by` | `uuid` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `last_scanned_at` | `timestamptz` |  Nullable |
| `scan_count` | `int4` |  Nullable |

## Table `tags`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `org_id` | `uuid` |  Nullable |
| `created_by` | `uuid` |  Nullable |
| `label` | `text` |  |
| `address` | `text` |  Nullable |
| `building` | `text` |  Nullable |
| `floor` | `text` |  Nullable |
| `room` | `text` |  Nullable |
| `specific_location` | `text` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |
| `folder_id` | `uuid` |  Nullable |

## Table `tags_categories`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `tag_id` | `uuid` | Primary |
| `category_id` | `uuid` | Primary |

## Table `tags_keywords`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `tag_id` | `uuid` | Primary |
| `keyword_id` | `uuid` | Primary |

