import { createClient } from '@supabase/supabase-js';
import HTTPMethod from 'http-method-enum';
import { NextApiRequest, NextApiResponse } from 'next';
import { CustomerDetails } from '../../models/customer.model';
import HttpStatusCode from '../../models/http-status-codes.enum';
import * as yup from 'yup';
import { Result } from '../../models/result.model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method == HTTPMethod.POST) {
        try {
            const customerSchema = yup.object({
                id: yup.string().required(),
                name: yup.string().nullable(),
                email: yup.string().nullable().email()
            })
            const customerDetails: CustomerDetails = req.body;

            const isCustomerDetailsValid = await customerSchema.isValid(customerDetails);

            switch (isCustomerDetailsValid) {
                case true:
                    {
                        const { httpStatusCode, message } = await updateCustomer(customerDetails);
                        res.statusCode = httpStatusCode;
                        res.json(message);
                        break;
                    }
                case false:
                    {
                        const { httpStatusCode, message } = customerDetailsInvalid();
                        res.statusCode = httpStatusCode;
                        res.json(message);
                        break;
                    }
                default:
                    res.statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
                    res.send(false);
                    break;
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

async function updateCustomer(customerDetails: CustomerDetails): Promise<Result> {
    const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '');
    const { data, error } = await supabase
        .from<CustomerDetails>(process.env.DB || '')
        .update({ name: customerDetails.name, email: customerDetails.email })
        .match({ id: customerDetails.id });
        if (error) {
            const result: Result = {
                httpStatusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
                message: error
            }
            return result
        } else {
            const result: Result = {
                httpStatusCode: HttpStatusCode.OK,
                message: data
            }
            return result
        }
}

function customerDetailsInvalid(): Result {
    const result: Result = {
        httpStatusCode: HttpStatusCode.BAD_REQUEST,
        message: false
    }
    return result
}