export type CrmLead = {
  id: string;
  type: string;
  name: string;
  phone: string;
  email?: string | null;
  city?: string | null;
  state?: string | null;
  businessType?: string | null;
  interestedIn?: string | null;
  interestedCategory?: string | null;
  message?: string | null;
  source: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  landingPage?: string | null;
  createdAt: string;
  extra?: Record<string, string | null | undefined>;
};

export interface CrmProvider {
  name: string;
  enabled(): boolean;
  send(lead: CrmLead): Promise<void>;
}
