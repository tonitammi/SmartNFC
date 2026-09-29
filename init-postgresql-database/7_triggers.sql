-- Triggers to set updated_at automatically

-- nfc tags, content_entries, organizations, organization_users, 
create trigger "handle_nfc_tags_updated_at" 
before update on nfc_tags
for each row execute procedure moddatetime (updated_at);

create trigger "handle_content_entries_updated_at" 
before update on content_entries
for each row execute procedure moddatetime (updated_at);

create trigger "handle_organizations_updated_at" 
before update on organizations
for each row execute procedure moddatetime (updated_at);

create trigger "handle_organization_users_updated_at" 
before update on organization_users
for each row execute procedure moddatetime (updated_at);

-- New user triggers

-- Create organization for user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_setup();

-- Check that folder organization isn't modified on updates or insert

CREATE TRIGGER trg_check_folder_org
BEFORE INSERT OR UPDATE ON content_folders
FOR EACH ROW EXECUTE FUNCTION check_folder_org_consistency(); 

-- Update nfc scan count NOT ADDED
CREATE TRIGGER on_nfc_scan_logged
AFTER INSERT ON nfc_scan_logs
FOR EACH ROW EXECUTE FUNCTION update_nfc_scan_count();

-- Delete organization invitation after organization user is deleted
CREATE OR REPLACE FUNCTION public.handle_organization_user_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- Poistetaan kyseisen sähköpostin kutsut samasta organisaatiosta
    DELETE FROM public.organization_invitations
    WHERE org_id = OLD.org_id AND email = OLD.email;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_organization_user_deleted
    AFTER DELETE ON public.organization_users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_organization_user_delete();