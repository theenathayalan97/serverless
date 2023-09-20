'use strict';

const databaseConnection = require(`../../utilities/databaseConfig`)
const Repo = databaseConnection.Repository()
const Repository = require("../../repository/" + Repo);
const { v4: uuidv4 } = require('uuid');
const messages = require('../../constant/constants')


class specialtyMasterController {
    //CreateAddress
    async  CreateSpecialtyMaster(req, res, tableName) {
        try {
            const request = {
                'tenant_id': req.tenant_id,
                'name': req.body.name
            }
            const specialtyMasterResponse = await Repository.queryItemsByAttributesAndIN(tableName, request)
            if (specialtyMasterResponse.length != 0) {
                return res.status(404).json({ message: messages.specialtyExists })
            }

            request.tenant_id = req.tenant_id
            request.created_by = req.id
            request.updated_by = req.id
            request.is_deleted = false
            request.specialty_amount 
            if(req.body.specialty_amount){
                request.specialty_amount = req.body.specialty_amount
            }else{
                request.specialty_amount = 0
            }

            if(req.body.specialty_currency){
                request.specialty_currency = req.body.specialty_currency
            }else{
                request.specialty_currency = 'INR'
            }
 
            if(req.body.specialty_currency_symbol){
                request.specialty_currency_symbol = req.body.specialty_currency_symbol
            }else{
                request.specialty_currency_symbol = 'Rs.'
            }

            //Add a new specialtyMaster
            const specialtyMasterCreate = await Repository.create(request, tableName)

            //return
            return res.status(201).json({ message: messages.createMessage, result: specialtyMasterCreate.uuid })


        } catch (error) {
            return res.status(400).json({ message: messages.errorMessage, result: error.message })
        }

    };

    //UpdateSpecialtyMaster
    async UpdateSpecialtyMaster(req, res, tableName) {
        try {
            let id = {
                "uuid": req.params.id
            }
            let specialtyMasterGet = await Repository.queryItemsByAttributesAndIN(tableName, id)
            if (specialtyMasterGet.length == 0) {
                return res.status(404).json({ message: messages.specialtyNotAvailable })
            }
            const request = req.body
            request.tenant_id = req.tenant_id
            request.created_by = req.id
            request.updated_by = req.id
            request.user_id = req.id
            //update a new specialtyMasterSchema 
            const specialtyMasterUpdate = await Repository.updateMultipleFields(id, request, tableName);

            //return
            return res.status(200).json({ message: messages.updateMessage, result: specialtyMasterUpdate.uuid })


        } catch (error) {
            return res.status(400).json({ message: messages.errorMessage, result: error.message })
        }

    };

    //GetSpecialtyMasterByID
    async GetSpecialtyMasterByID(req, res, tableName) {
        try {

            if (Object.keys(req.query).length == 0) {
                let querys = {
                    "tenant_id": req.tenant_id
                }
                querys.is_deleted = false
                let specialtyMasterGet = await Repository.queryItemsByAttributesAndIN(tableName, querys)
                if (specialtyMasterGet.length == 0) {
                    return res.status(404).json({ message: messages })
                }
                return res.status(200).json({ message: messages.getMessage, result: specialtyMasterGet })
            }
            let querys = req.query
            querys.is_deleted = false
            let specialtyMasterGet = await Repository.queryItemsByAttributesAndIN(tableName, querys)
            if (specialtyMasterGet.length == 0) {
                return res.status(404).json({ message: messages.specialtyNotAvailable })
            }
            return res.status(200).json({ message: messages.getMessage, result: specialtyMasterGet })


        } catch (error) {
            return res.status(400).json({ message: messages.errorMessage, result: error.message })
        }
    };

}

module.exports = new specialtyMasterController()
