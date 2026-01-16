-- Create lab_tests table for managing available tests
CREATE TABLE public.lab_tests (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    lab_id UUID NOT NULL,
    test_name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    offer_price DECIMAL(10,2),
    category TEXT,
    turnaround_time TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transactions table for tracking balance
CREATE TABLE public.transactions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    user_role TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
    amount DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    reference_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create test_bookings table
CREATE TABLE public.test_bookings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    lab_id UUID NOT NULL,
    test_id UUID NOT NULL REFERENCES public.lab_tests(id) ON DELETE CASCADE,
    patient_name TEXT NOT NULL,
    patient_phone TEXT,
    patient_email TEXT,
    booking_date DATE NOT NULL DEFAULT CURRENT_DATE,
    amount_paid DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_bookings ENABLE ROW LEVEL SECURITY;

-- RLS policies for lab_tests
CREATE POLICY "Labs can view their tests" ON public.lab_tests FOR SELECT USING (auth.uid() = lab_id);
CREATE POLICY "Labs can create tests" ON public.lab_tests FOR INSERT WITH CHECK (auth.uid() = lab_id);
CREATE POLICY "Labs can update their tests" ON public.lab_tests FOR UPDATE USING (auth.uid() = lab_id);
CREATE POLICY "Labs can delete their tests" ON public.lab_tests FOR DELETE USING (auth.uid() = lab_id);

-- RLS policies for transactions
CREATE POLICY "Users can view their transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for test_bookings
CREATE POLICY "Labs can view their bookings" ON public.test_bookings FOR SELECT USING (auth.uid() = lab_id);
CREATE POLICY "Labs can create bookings" ON public.test_bookings FOR INSERT WITH CHECK (auth.uid() = lab_id);
CREATE POLICY "Labs can update their bookings" ON public.test_bookings FOR UPDATE USING (auth.uid() = lab_id);
CREATE POLICY "Labs can delete their bookings" ON public.test_bookings FOR DELETE USING (auth.uid() = lab_id);

-- Create triggers for updated_at
CREATE TRIGGER update_lab_tests_updated_at BEFORE UPDATE ON public.lab_tests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_test_bookings_updated_at BEFORE UPDATE ON public.test_bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();