import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { HTTPMethod } from 'http-method-enum';
import HttpStatusCode from '../../models/http-status-codes.enum';
import { NewCustomer } from '../../models/customer.model';
import * as yup from 'yup';
import { NewCustomerDto } from '../../dto/customer-details.dto';
import { Result } from '../../models/result.model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method == HTTPMethod.POST) {
        try {
            const newCustomerSchema = yup.object({
                name: yup.string(),
                email: yup.string().email()
            })
            const newCustomerDetails: NewCustomer = req.body;

            const isNewCustomerDetailsValid = await newCustomerSchema.isValid(newCustomerDetails);

            switch (isNewCustomerDetailsValid) {
                case true:
                    {
                        const { httpStatusCode, message } = await addNewCustomer(newCustomerDetails);
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

async function addNewCustomer(newCustomerDetails: NewCustomer): Promise<Result> {
    const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '');
    const { data, error } = await supabase
        .from<NewCustomerDto>(process.env.DB || '')
        .insert({ ...newCustomerDetails })
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
