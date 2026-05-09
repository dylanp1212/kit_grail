/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { WishlistController } from './../src/wishlist/controller';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "Size": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["xsmall"]},{"dataType":"enum","enums":["small"]},{"dataType":"enum","enums":["medium"]},{"dataType":"enum","enums":["large"]},{"dataType":"enum","enums":["xlarge"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WishlistItem": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "seller": {"dataType":"string","required":true},
            "title": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "size": {"ref":"Size","required":true},
            "colors": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "listed": {"dataType":"datetime","required":true},
            "price": {"dataType":"double","required":true},
            "image": {"dataType":"string"},
            "added": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsWishlistController_getAllWishlistItems: Record<string, TsoaRoute.ParameterSchema> = {
                userid: {"in":"path","name":"userid","required":true,"dataType":"string"},
                search: {"in":"query","name":"search","dataType":"string"},
        };
        app.get('/wishlist/:userid',
            ...(fetchMiddlewares<RequestHandler>(WishlistController)),
            ...(fetchMiddlewares<RequestHandler>(WishlistController.prototype.getAllWishlistItems)),

            async function WishlistController_getAllWishlistItems(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWishlistController_getAllWishlistItems, request, response });

                const controller = new WishlistController();

              await templateService.apiHandler({
                methodName: 'getAllWishlistItems',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWishlistController_checkInWishlist: Record<string, TsoaRoute.ParameterSchema> = {
                userid: {"in":"path","name":"userid","required":true,"dataType":"string"},
                listingid: {"in":"path","name":"listingid","required":true,"dataType":"string"},
        };
        app.get('/wishlist/:userid/:listingid',
            ...(fetchMiddlewares<RequestHandler>(WishlistController)),
            ...(fetchMiddlewares<RequestHandler>(WishlistController.prototype.checkInWishlist)),

            async function WishlistController_checkInWishlist(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWishlistController_checkInWishlist, request, response });

                const controller = new WishlistController();

              await templateService.apiHandler({
                methodName: 'checkInWishlist',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWishlistController_addToWishlist: Record<string, TsoaRoute.ParameterSchema> = {
                userid: {"in":"path","name":"userid","required":true,"dataType":"string"},
                listingid: {"in":"path","name":"listingid","required":true,"dataType":"string"},
        };
        app.post('/wishlist/:userid/:listingid',
            ...(fetchMiddlewares<RequestHandler>(WishlistController)),
            ...(fetchMiddlewares<RequestHandler>(WishlistController.prototype.addToWishlist)),

            async function WishlistController_addToWishlist(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWishlistController_addToWishlist, request, response });

                const controller = new WishlistController();

              await templateService.apiHandler({
                methodName: 'addToWishlist',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWishlistController_removeFromWishlist: Record<string, TsoaRoute.ParameterSchema> = {
                userid: {"in":"path","name":"userid","required":true,"dataType":"string"},
                listingid: {"in":"path","name":"listingid","required":true,"dataType":"string"},
        };
        app.delete('/wishlist/:userid/:listingid',
            ...(fetchMiddlewares<RequestHandler>(WishlistController)),
            ...(fetchMiddlewares<RequestHandler>(WishlistController.prototype.removeFromWishlist)),

            async function WishlistController_removeFromWishlist(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWishlistController_removeFromWishlist, request, response });

                const controller = new WishlistController();

              await templateService.apiHandler({
                methodName: 'removeFromWishlist',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
