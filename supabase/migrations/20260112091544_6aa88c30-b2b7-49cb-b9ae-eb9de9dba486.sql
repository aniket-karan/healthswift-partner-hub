-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID NOT NULL,
  patient_name TEXT NOT NULL,
  patient_email TEXT,
  patient_phone TEXT,
  patient_age INTEGER,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  symptoms TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create time_slots table for doctor availability
CREATE TABLE public.time_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID NOT NULL,
  slot_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(doctor_id, slot_date, start_time)
);

-- Create prescriptions table
CREATE TABLE public.prescriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  doctor_id UUID NOT NULL,
  patient_name TEXT NOT NULL,
  medications JSONB,
  notes TEXT,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lab_reports table
CREATE TABLE public.lab_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lab_id UUID NOT NULL,
  patient_name TEXT NOT NULL,
  test_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'uploaded')),
  file_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_reports ENABLE ROW LEVEL SECURITY;

-- RLS policies for appointments (doctors can manage their own)
CREATE POLICY "Doctors can view their appointments"
ON public.appointments FOR SELECT
USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can create appointments"
ON public.appointments FOR INSERT
WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Doctors can update their appointments"
ON public.appointments FOR UPDATE
USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can delete their appointments"
ON public.appointments FOR DELETE
USING (auth.uid() = doctor_id);

-- RLS policies for time_slots (doctors can manage their own)
CREATE POLICY "Doctors can view their time slots"
ON public.time_slots FOR SELECT
USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can create time slots"
ON public.time_slots FOR INSERT
WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Doctors can update their time slots"
ON public.time_slots FOR UPDATE
USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can delete their time slots"
ON public.time_slots FOR DELETE
USING (auth.uid() = doctor_id);

-- RLS policies for prescriptions (doctors can manage their own)
CREATE POLICY "Doctors can view their prescriptions"
ON public.prescriptions FOR SELECT
USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can create prescriptions"
ON public.prescriptions FOR INSERT
WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Doctors can update their prescriptions"
ON public.prescriptions FOR UPDATE
USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can delete their prescriptions"
ON public.prescriptions FOR DELETE
USING (auth.uid() = doctor_id);

-- RLS policies for lab_reports (labs can manage their own)
CREATE POLICY "Labs can view their reports"
ON public.lab_reports FOR SELECT
USING (auth.uid() = lab_id);

CREATE POLICY "Labs can create reports"
ON public.lab_reports FOR INSERT
WITH CHECK (auth.uid() = lab_id);

CREATE POLICY "Labs can update their reports"
ON public.lab_reports FOR UPDATE
USING (auth.uid() = lab_id);

CREATE POLICY "Labs can delete their reports"
ON public.lab_reports FOR DELETE
USING (auth.uid() = lab_id);

-- Add updated_at triggers
CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_time_slots_updated_at
BEFORE UPDATE ON public.time_slots
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prescriptions_updated_at
BEFORE UPDATE ON public.prescriptions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lab_reports_updated_at
BEFORE UPDATE ON public.lab_reports
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage buckets for files
INSERT INTO storage.buckets (id, name, public) VALUES ('prescriptions', 'prescriptions', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('lab-reports', 'lab-reports', false);

-- Storage policies for prescriptions bucket (doctors only)
CREATE POLICY "Doctors can upload prescriptions"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'prescriptions' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Doctors can view their prescriptions"
ON storage.objects FOR SELECT
USING (bucket_id = 'prescriptions' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Doctors can update their prescriptions"
ON storage.objects FOR UPDATE
USING (bucket_id = 'prescriptions' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Doctors can delete their prescriptions"
ON storage.objects FOR DELETE
USING (bucket_id = 'prescriptions' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for lab-reports bucket (labs only)
CREATE POLICY "Labs can upload reports"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'lab-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Labs can view their reports"
ON storage.objects FOR SELECT
USING (bucket_id = 'lab-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Labs can update their reports"
ON storage.objects FOR UPDATE
USING (bucket_id = 'lab-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Labs can delete their reports"
ON storage.objects FOR DELETE
USING (bucket_id = 'lab-reports' AND auth.uid()::text = (storage.foldername(name))[1]);