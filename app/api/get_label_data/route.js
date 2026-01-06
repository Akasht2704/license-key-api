import { log } from 'console';
import {NextResponse} from 'next/server';


export async function GET(request) {

    try {

         const { searchParams } = new URL(request.url);

         const a = searchParams.get('a');
         const b = searchParams.get('b');
         const c = searchParams.get('c');

         if(a==1 && b==2 && c==3){
             return NextResponse.json({success: true,
                  data:[
                     {
                         PoductName:'P1NAME',
                         MRP:'INR 100',
                         QRCODE:'XYZ1'
                     },
                     {
                         PoductName:'P2NAME',
                         MRP:'INR 200',
                         QRCODE:'XYZ2'
                     }
                     
                  ] }, { status: 200 });
            } else {
                return NextResponse.json({success: false, message:'Invalid Params' }, { status: 400 });
            }
        
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
        
    }

   

    
}