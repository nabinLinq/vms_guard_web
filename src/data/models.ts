export interface MockVisitHost {
  id: string;
  name: string;
  email?: string;
}

export interface MockVisit {
  id: string;
  type: string; // e.g. REGULAR, FREQUENT, WALKIN
  status: string; // PENDING, APPROVED, CHECKED_IN, CHECKED_OUT
  purposeType: string; // MEETING, DELIVERY, PERSONAL, INTERVIEW, MAINTENANCE, OTHER
  scheduledDate: string;
  startTime?: string;
  endTime?: string;
  
  // Visitor Details
  visitorName: string;
  visitorPhone: string;
  visitorCompany: string;
  visitorPhotoUrl?: string; 

  qrCode: string;
  createdAt: string;
  
  host: MockVisitHost;
}

export interface MockNotice {
  id: string;
  title: string;
  body: string;
  postedAt: string;
  isImportant: boolean;
}
