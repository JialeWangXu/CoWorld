import {connectMD} from "../../../../lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { message } from "util/message";
import CandidateProfile from "models/CandidateProfile";
import jwt from 'jsonwebtoken';
import User from "models/User";


export async function POST(request:NextRequest) {
    try{
        await connectMD();

        try{
            const accessToken = request.cookies.get('accessTokenCookie').value;
             //@ts-ignore
            const {data} = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
            console.log("Access aprobado para editar")
            const profile = await CandidateProfile.findOne({user_id: data._id}).populate('user_id').lean();
            if(!profile){
                return NextResponse.json({
                error:message.error.profileLoadError
                }, {status:400})
            }

            const body = await request.json();
            const {photo, firstname, lastname, fisica, auditiva, intelectual, hablar, pluridiscapacidad, visual, mental, city, phone } = body

            if(photo){
                const resul = await CandidateProfile.findOneAndUpdate(
                    { user_id: data._id },
                    {
                        photo: photo,
                        city: city,
                        phone: phone,
                        "disabilities.$[fisica].degree": fisica,
                        "disabilities.$[auditiva].degree": auditiva,
                        "disabilities.$[intelectual].degree": intelectual,
                        "disabilities.$[pluridiscapacidad].degree": pluridiscapacidad,
                        "disabilities.$[visual].degree": visual,
                        "disabilities.$[mental].degree": mental,
                        "disabilities.$[hablar].degree": hablar,
                    },
                    {
                        new: true, 
                        arrayFilters: [
                            { "fisica.type": "fisica" },
                            { "auditiva.type": "auditiva" },
                            { "intelectual.type": "intelectual" },
                            { "pluridiscapacidad.type": "pluridiscapacidad" },
                            { "visual.type": "visual" },
                            { "mental.type": "mental" },
                            { "hablar.type": "hablar" },
                        ]
                    }
                );

                const infoUser = await User.findOneAndUpdate({_id:data._id}, {firstname:firstname, lastname:lastname}, {new:true});
                if(!resul || !infoUser){
                    return NextResponse.json({
                        error:message.error.profileEditError
                    },{status:400})
                }

                return NextResponse.json({
                    sucess:message.sucess.ProfileEdited
                },{status:200})
            }
            
            const {huntingJob, desiredJob, state} = body;
            if(huntingJob){
                const resul = await CandidateProfile.findOneAndUpdate(
                    { user_id: data._id },
                    {
                        huntingJob: huntingJob,
                        desiredJob: desiredJob,
                        state: state
                    },
                    {new:true}
                );
                if(!resul){
                    return NextResponse.json({
                        error:message.error.profileEditError
                    },{status:400})
                }

                return NextResponse.json({
                    sucess:message.sucess.ProfileEdited
                },{status:200})
            }

            const {description} = body;
            if(description){
                const resul = await CandidateProfile.findOneAndUpdate(
                    { user_id: data._id },
                    {
                        description: description
                    },
                    {new:true}
                );
                if(!resul){
                    return NextResponse.json({
                        error:message.error.profileEditError
                    },{status:400})
                }
                return NextResponse.json({
                    sucess:message.sucess.ProfileEdited
                },{status:200})
            }

            const {newStudy} = body;
            if(newStudy){
                const {iniDate, finDate, institution, specialty, title }=body;
                var resul;
                if(finDate !== undefined){
                    resul = await CandidateProfile.findOneAndUpdate(
                    { user_id: data._id },
                    {
                        $push: {studies: {iniDate:iniDate, 
                            finDate:finDate,
                            institution:institution, 
                            specialty:specialty, 
                            title:title}}
                    },
                        {new:true}
                    );
                }else{
                    resul = await CandidateProfile.findOneAndUpdate(
                        { user_id: data._id },
                        {
                            $push: {studies: {iniDate:iniDate, 
                                institution:institution, 
                                specialty:specialty, 
                                title:title}}
                        },
                            {new:true}
                        );
                }
                if(!resul){
                    return NextResponse.json({
                        error:message.error.profileEditError
                    },{status:400})
                }
                return NextResponse.json({
                    sucess:message.sucess.ProfileEdited
                },{status:200})
            }

            const {modifyStudy} = body;
            if(modifyStudy){
                const {iniDate, finDate, institution, specialty, title, index }=body;
                const profile = await CandidateProfile.findOne({user_id: data._id});
                if(finDate !== undefined){
                    profile.studies.set(index, {iniDate:iniDate, finDate:finDate, institution:institution, specialty:specialty, title:title} );
                }else{
                    profile.studies.set(index, {iniDate:iniDate, institution:institution, specialty:specialty, title:title} );
                }
                const resul = await profile.save();
                if(!resul){
                    return NextResponse.json({
                        error:message.error.profileEditError
                    },{status:400})
                }
                return NextResponse.json({
                    sucess:message.sucess.ProfileEdited
                },{status:200})
            }

            const {deleteStudy} = body;
            if(deleteStudy){
                console.log('Eliminar estudio!!!!!!!!!!!!!!!!!!!');
                const profile = await CandidateProfile.findOne({user_id: data._id});
                profile.studies.splice(body.index,1);
                const resul = await profile.save();
                if(!resul){
                    return NextResponse.json({
                        error:message.error.profileEditError
                    },{status:400})
                }
                return NextResponse.json({
                    sucess:message.sucess.ProfileEdited
                },{status:200})
            }

            }catch(tokenError){
                return NextResponse.json({
                    error:message.error.noToken,tokenError
                },{status:400})
            }

    }catch(e){
        return NextResponse.json({
            error:message.error.genericError,e
        },{status:500})
    }
}