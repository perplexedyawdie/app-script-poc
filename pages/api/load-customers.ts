import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { CustomerDetailsDto } from '../../dto/customer-details.dto';
import HTTPMethod from 'http-method-enum';
import HttpStatusCode from '../../models/http-status-codes.enum';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method == HTTPMethod.GET) {
        try {
            const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '');
            const { data, error } = await supabase
                .from<CustomerDetailsDto>(process.env.DB || '')
                .select('id, name, email');
            if (error) {
                res.statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
                res.json(error);
            } else {
                res.statusCode = HttpStatusCode.OK;
                res.json(data);
            }
        } catch (error) {
            res.statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
            res.json(error);
        }
    } else {
        res.statusCode = HttpStatusCode.METHOD_NOT_ALLOWED;
        res.send(false);
    }
}