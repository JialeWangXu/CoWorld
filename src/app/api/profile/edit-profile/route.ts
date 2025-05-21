import {connectMD} from "../../../../lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { message } from "util/message";
import CandidateProfile from "models/CandidateProfile";
import jwt from 'jsonwebtoken';
import User from "models/User";
import { onlyLastNames, onlyLetters } from "util/patterns";


export async function POST(request:NextRequest) {
    try{
        await connectMD();

        try{
            const accessToken = request.cookies.get('accessTokenCookie').value;
             //@ts-ignore
            const {data} = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
            const profile = await CandidateProfile.findOne({user_id: data._id}).populate('user_id').lean();
            if(!profile){
                return NextResponse.json({
                error:message.error.profileLoadError
                }, {status:400})
            }

            const body = await request.json();
            const {photo, firstname, lastname, fisica, auditiva, intelectual, hablar, pluridiscapacidad, visual, mental, city, phone } = body

            // Section to edit personal information
            if(firstname){

                if(!onlyLetters(firstname)){
                    return NextResponse.json({
                        error: message.error.onlyLetterName
                    }, {status:400})
                }
                if(!onlyLastNames(lastname)){
                    return NextResponse.json({
                        error: message.error.onlyLetterSpace
                    }, {status:400})
                }

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
            
            // Section to edit situacion laboral
            const {huntingJob, desiredJob, state} = body;
            if(state){
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

            // Section to edit personal description
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

            // Section to add  new study
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

            // Section to modify study
            const {modifyStudy} = body;
            if(modifyStudy){
                const {iniDate, finDate, institution, specialty, title, index }=body;
                const profile = await CandidateProfile.findOne({user_id: data._id});
                if(finDate !== undefined){
                    profile.studies[index] = {iniDate:iniDate, finDate:finDate, institution:institution, specialty:specialty, title:title};
                }else{
                    profile.studies[index] = {iniDate:iniDate, institution:institution, specialty:specialty, title:title};
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

            // Section to delete study
            const {deleteStudy} = body;
            if(deleteStudy){
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

            // Section to add new work experience
            const {newWork} = body;
            if(newWork){
                const {iniDate, finDate, responsability, companyName, contractType }=body;
                var resul;
                if(finDate !== undefined){
                    resul = await CandidateProfile.findOneAndUpdate(
                    { user_id: data._id },
                    {
                        $push: {workExperience: {
                            responsability:responsability, 
                            companyName:companyName, 
                            contractType:contractType,
                            iniDate:iniDate, 
                            finDate:finDate,
                        }}
                    },
                        {new:true}
                    );
                }else{
                    resul = await CandidateProfile.findOneAndUpdate(
                        { user_id: data._id },
                        {
                            $push: {workExperience: {
                                responsability:responsability, 
                                companyName:companyName, 
                                contractType:contractType,
                                iniDate:iniDate, 
}}
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

            // Section to modify work experience
            const {modifyWorkExp} = body;
            if(modifyWorkExp){
                const {iniDate, finDate, responsability, companyName, contractType,index }=body;
                const profile = await CandidateProfile.findOne({user_id: data._id});
                if(finDate !== undefined){
                    profile.workExperience[index] = { responsability:responsability, companyName:companyName, contractType:contractType, iniDate:iniDate, finDate:finDate };
                }else{
                    profile.workExperience[index]= {responsability:responsability, companyName:companyName, contractType:contractType, iniDate:iniDate};
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

            // Section to delete work experience
            const {deleteWorkExp} = body;
            if(deleteWorkExp){
                const profile = await CandidateProfile.findOne({user_id: data._id});
                profile.workExperience.splice(body.index,1);
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

            // Section to edit skills
            const {skills} = body;
            if(skills){
                const resul = await CandidateProfile.findOneAndUpdate(
                    { user_id: data._id },
                    {
                        skills: skills
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

            // Section to add new certification
            const {newCertification} = body;
            if(newCertification){
                const { title, emitter}=body;
                const resul = await CandidateProfile.findOneAndUpdate(
                    { user_id: data._id },
                    {
                        $push: {certifications: {
                            title:title, 
                            emitter:emitter}}
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

            // Section to modify certication
            const {modifyCertification} = body;
            if(modifyCertification){
            const {title, emitter,index }=body;
            const profile = await CandidateProfile.findOne({user_id: data._id});
            profile.certifications[index]={ title:title, emitter:emitter};
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

            // Section to delete certification
            const {deleteCertification} = body;
            if(deleteCertification){
                const profile = await CandidateProfile.findOne({user_id: data._id});
                profile.certifications.splice(body.index,1);
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

            // Section to add language
            const {newLanguage} = body;
            if(newLanguage){
                const { language, level}=body;
                const resul = await CandidateProfile.findOneAndUpdate(
                    { user_id: data._id },
                    {
                        $push: {languages: {
                            language:language, 
                            level:level}}
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
            
            // Section to modify certication
            const {modifyLanguage} = body;
            if(modifyLanguage){
            const {language, level,index }=body;
            const profile = await CandidateProfile.findOne({user_id: data._id});
            profile.languages[index]={ language:language, level:level};
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

            // Section to delete language
            const {deleteLanguage} = body;
            if(deleteLanguage){
                const profile = await CandidateProfile.findOne({user_id: data._id});
                profile.languages.splice(body.index,1);
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
                },{status:401})
            }

    }catch(e){
        return NextResponse.json({
            error:message.error.genericError,e
        },{status:500})
    }
}