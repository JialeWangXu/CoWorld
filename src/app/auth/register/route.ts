import {connectMD} from "../../../lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
    try{
        await connectMD();
        return NextResponse.json({
            message: "Connected!"
        })
    }catch(e){
        console.log("Error registering", e);
    }
}