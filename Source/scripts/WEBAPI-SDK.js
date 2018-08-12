
// API version number used for this library. 2016 onward
// Adjust manually or
// A call to versionNumber function attempts to set the version to the current version of the CRM.
var SDKWEBAPI_VERSION_USERD = '8.1';
var SDKWEBAPI_APIVERSION_USERD = 8;
var SDKWEBAPI_GLOBALCONTEXT = null;

var SdkWebAPI = (function (SdkWebAPI) {
    SdkWebAPI.create = function (entitySetName, entity, returnId, successCallback, errorCallback, passthroughObj, passthroughObj1, callerId) {
        /// <summary>Create a new entity</summary>
        /// <param name="entitySetName" type="String">The name of the entity set for the entity you want to create.</param>
        /// <param name="entity" type="Object">An object with the properties for the entity you want to create.</param>      
        /// <param name="returnId" type="boolean">true will return the GUID of the created record. false or null returns the URI of the created record.</param>   
        /// <param name="successCallback" type="Function">The function to call when the entity is created. The Uri of the created entity is passed to this function.</param>
        /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
        /// <param name="callerId" type="String" optional="true" optional="true">The systemuserid value of the user to impersonate</param>
        if (!isString(entitySetName)) {
            throw new Error("SdkWebAPI.create entitySetName parameter must be a string.");
        }
        if (isNullOrUndefined(entity)) {
            throw new Error("SdkWebAPI.create entity parameter must not be null or undefined.");
        }
        if (isNullOrUndefined(returnId)) {
            throw new Error("SdkWebAPI.create returnId parameter must not be null or undefined.");
        }
        if (!isFunctionOrNullOrUndefined(successCallback)) {
            throw new Error("SdkWebAPI.create successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNullOrUndefined(errorCallback)) {
            throw new Error("SdkWebAPI.create errorCallback parameter must be a function or null.");
        }
        if (!isAcceptableCallerId(callerId)) {
            throw new Error("SdkWebAPI.create callerId parameter must be a string or null.");
        }

        var async = !!successCallback;

        var req = new XMLHttpRequest();
        req.open("POST", encodeURI(getWebAPIPath() + entitySetName), async);
        req.setRequestHeader("Accept", "application/json");
        if (callerId) {
            req.setRequestHeader("MSCRMCallerID", callerId);
        }
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        if (async) {
            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    req.onreadystatechange = null;
                    if (this.status == 204) {
                        if (successCallback)
                            successCallback(this.getResponseHeader("OData-EntityId"), passthroughObj, passthroughObj1);
                    }
                    else {
                        if (errorCallback)
                            errorCallback(SdkWebAPI.errorHandler(this), "Create Entity");
                    }
                }
            };
        }
        req.send(JSON.stringify(entity));
        if (!async) {
            var createResult = null;
            try {
                createResult = req.getResponseHeader("OData-EntityId");
                if (returnId) {
                    createResult = SdkWebAPI.GetIdFromUri(createResult);
                }
            } catch (e) {
            }
            return createResult;
        }
    }
    SdkWebAPI.retrieve = function (uri, properties, filters, navigationproperties, successCallback, errorCallback, includeFormattedValues, eTag, unmodifiedCallback, callerId) {
        /// <summary>Retrieve an entity</summary>
        /// <param name="uri" type="String">The Uri for the entity you want to retrieve</param>
        /// <param name="properties" type="Array">An array of strings representing the entity properties you want to retrieve.</param>
        /// <param name="navigationproperties" type="String">An array of strings representing the navigation properties and any system query options you want to retrieve.</param>
        /// <param name="successCallback" type="Function">The function to call when the entity is retrieved. The entity data will be passed to this function.</param>
        /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
        /// <param name="includeFormattedValues" type="Boolean" optional="true">Whether you want to return formatted values.</param>
        /// <param name="eTag" type="String" optional="true">When provided and the entity has not been modified since the eTag value was retrieved, the unmodifiedCallback will be called.</param>
        /// <param name="unmodifiedCallback" type="Function" optional="true">The function to call when the entity has not been modified since last retrieved based on the eTag value. No entity data will be passed to this function.</param>
        /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
        if (!isString(uri)) {
            throw new Error("SdkWebAPI.retrieve uri parameter must be a string.");
        }
        if (!isStringOrNull(filters)) {
            throw new Error("SdkWebAPI.retrieve filters parameter must be null or string.");
        }
        if (!isStringArrayOrNull(properties)) {
            throw new Error("SdkWebAPI.retrieve properties parameter must be an array of strings or null.");
        }
        if (!isStringArrayOrNull(navigationproperties)) {
            throw new Error("SdkWebAPI.retrieve navigationproperties parameter must be an array of strings or null.");
        }
        if (!isFunctionOrNull(successCallback)) {
            throw new Error("SdkWebAPI.retrieve successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallback)) {
            throw new Error("SdkWebAPI.retrieve errorCallback parameter must be a function or null.");
        }
        if (!isBooleanOrNullOrUndefined(includeFormattedValues)) {
            throw new Error("SdkWebAPI.retrieve includeFormattedValues parameter must be a boolean, null, or undefined.");
        }
        if (!isStringOrNullOrUndefined(eTag)) {
            throw new Error("SdkWebAPI.retrieve eTag parameter must be a string, null or undefined.");
        }
        if (!isFunctionOrNullOrUndefined(unmodifiedCallback)) {
            throw new Error("SdkWebAPI.retrieve unmodifiedCallback parameter must be a function, null or undefined.");
        }
        if (!isAcceptableCallerId(callerId)) {
            throw new Error("SdkWebAPI.retrieve callerId parameter must be a string null or undefined.");
        }

        if (properties || navigationproperties) {
            uri += "?";
        }
        if (properties) {
            uri += "$select=" + properties.join();
        }
        if (filters) {
            uri += '&$filter=' + filters;
        }
        if (navigationproperties) {
            if (properties) {
                url += "&$expand=" + navigationproperties.join();
            }
            else {
                url += "$expand=" + navigationproperties.join();
            }
        }

        var req = new XMLHttpRequest();
        req.open("GET", encodeURI(uri), true);
        req.setRequestHeader("Accept", "application/json");
        if (callerId) {
            req.setRequestHeader("MSCRMCallerID", callerId);
        }
        if (eTag) {
            req.setRequestHeader("If-None-Match", eTag);
        }
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        if (includeFormattedValues) {
            req.setRequestHeader("Prefer", "odata.include-annotations=\"OData.Community.Display.V1.FormattedValue\"");
            //req.setRequestHeader("Prefer", "odata.include-annotations=\"mscrm.formattedvalue\"");
        }

        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                switch (this.status) {
                    case 200:
                        if (successCallback)
                            successCallback(JSON.parse(this.response, dateReviver).value);
                        break;
                    case 304: //Not modified
                        if (isFunction(unmodifiedCallback))
                            unmodifiedCallback();
                        break;
                    default:
                        if (errorCallback)
                            errorCallback(SdkWebAPI.errorHandler(this), "Retrieve Entity Properties");
                        break;
                }
            }
        };
        req.send();
    }
    SdkWebAPI.retrievePropertyValue = function (uri, propertyName, successCallback, errorCallback, includeFormattedValues, passthroughObj, passthroughObj1, callerId) {
        /// <summary>Retrieve the value of an entity property</summary>
        /// <param name="uri" type="String">The Uri for the entity with the property you want to retrieve</param>
        /// <param name="propertyName" type="String">A string representing the entity property you want to retrieve.</param>
        /// <param name="successCallback" type="Function">The function to call when the entity is retrieved. The property value will be passed to this function.</param>
        /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
        /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
        if (!isString(uri)) {
            throw new Error("SdkWebAPI.retrieveProperty uri parameter must be a string.");
        }
        if (!isString(propertyName)) {
            throw new Error("SdkWebAPI.retrieveProperty propertyName parameter must be a string.");
        }
        if (!isFunctionOrNull(successCallback)) {
            throw new Error("SdkWebAPI.retrieveProperty successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallback)) {
            throw new Error("SdkWebAPI.retrieveProperty errorCallback parameter must be a function or null.");
        }
        if (!isAcceptableCallerId(callerId)) {
            throw new Error("SdkWebAPI.retrieveProperty callerId parameter must be a string or null.");
        }
        if (!isBooleanOrNullOrUndefined(includeFormattedValues)) {
            throw new Error("SdkWebAPI.retrievePropertyValue includeFormattedValues parameter must be a boolean, null, or undefined.");
        }

        var async = !!successCallback;

        var req = new XMLHttpRequest();
        req.open("GET", encodeURI(uri + "/" + propertyName), true);
        req.setRequestHeader("Accept", "application/json");
        if (callerId) {
            req.setRequestHeader("MSCRMCallerID", callerId);
        }
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        if (includeFormattedValues) {
            req.setRequestHeader("Prefer", "odata.include-annotations=\"OData.Community.Display.V1.FormattedValue\"");
        }

        if(async) {
            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    req.onreadystatechange = null;
                    switch (this.status) {
                        case 200:
                            if (successCallback)
                                successCallback(JSON.parse(this.response, dateReviver).value);
                            break;
                        case 204:
                            if (successCallback)
                                successCallback(null);
                            break;
                        default:
                            if (errorCallback)
                                errorCallback(SdkWebAPI.errorHandler(this), "Retrieve Property Value");
                            break;
                    }
                }
            };
        }
        req.send();
        if(!async) {
            return JSON.parse(this.response, dateReviver).value;
            /*
{
   "@odata.context":"http://[Organization URI]/api/data/v8.2/$metadata#contacts(fullname,jobtitle,annualincome)/$entity",
   "@odata.etag":"W/\"619718\"",
   "fullname":"Yvonne McKay (sample)",
   "jobtitle":"Coffee Master",
   "annualincome@OData.Community.Display.V1.FormattedValue":"$45,000.00",
   "annualincome":45000.0000,
   "_transactioncurrencyid_value@OData.Community.Display.V1.FormattedValue":"US Dollar",
   "_transactioncurrencyid_value":"518c78c9-d3f6-e511-80d0-00155da84802",
   "contactid":"15c364b2-bf43-e611-80d5-00155da84802"
}
             */
        }
    }
    SdkWebAPI.update = function (uri, updatedEntity, successCallback, errorCallback, passthroughObj, passthroughObj1, callerId) {
        /// <summary>Update an entity</summary>
        /// <param name="uri" type="String">The Uri for the entity you want to update</param>
        /// <param name="updatedEntity" type="Object">An object that contains updated properties for the entity.</param>
        /// <param name="successCallback" type="Function">The function to call when the entity is updated.</param>
        /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
        /// <param name="callerId" type="String" optional="true" optional="true">The systemuserid value of the user to impersonate</param>
        if (!isString(uri)) {
            throw new Error("SdkWebAPI.update uri parameter must be a string.");
        }
        if (isNullOrUndefined(updatedEntity)) {
            throw new Error("SdkWebAPI.update updatedEntity parameter must not be null or undefined.");
        }
        if (!isFunctionOrNullOrUndefined(successCallback)) {
            throw new Error("SdkWebAPI.update successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNullOrUndefined(errorCallback)) {
            throw new Error("SdkWebAPI.update errorCallback parameter must be a function or null.");
        }
        if (!isAcceptableCallerId(callerId)) {
            throw new Error("SdkWebAPI.update callerId parameter must be a string or null.");
        }

        var async = !!successCallback;

        var req = new XMLHttpRequest();
        req.open("PATCH", encodeURI(uri), async);
        req.setRequestHeader("Accept", "application/json");
        if (callerId) {
            req.setRequestHeader("MSCRMCallerID", callerId);
        }
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        if (async) {
            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    req.onreadystatechange = null;
                    if (this.status == 204) {
                        if (successCallback) {
                            var idwithlink = this.getResponseHeader("OData-EntityId");
                            //var id = GetIdFromUri(idwithlink);
                            //console.log("idwithlink " + idwithlink + " id " + id);
                            successCallback(idwithlink, passthroughObj, passthroughObj1);
                        }
                    }
                    else {
                        if (errorCallback)
                            errorCallback(SdkWebAPI.errorHandler(this), "Update Record");
                    }
                }
            };
        }
        req.send(JSON.stringify(updatedEntity));
        if (!async) {
            return req.getResponseHeader("OData-EntityId");
        }
    }
    SdkWebAPI.updatePropertyValue = function (uri, propertyName, value, successCallback, errorCallback, callerId) {
        /// <summary>Update an entity property</summary>
        /// <param name="uri" type="String">The Uri for the entity with the property you want to update</param>
        /// <param name="updatedEntity" type="Object">An object that contains updated properties for the entity.</param>
        /// <param name="successCallback" type="Function">The function to call when the entity property value is updated. The property value will be passed to this function.</param>
        /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
        /// <param name="callerId" type="String" optional="true" optional="true">The systemuserid value of the user to impersonate</param>
        if (!isString(uri)) {
            throw new Error("SdkWebAPI.updateProperty uri parameter must be a string.");
        }
        if (!isString(propertyName)) {
            throw new Error("SdkWebAPI.updateProperty propertyName parameter must be a string.");
        }
        if (isNullOrUndefined(value)) {
            throw new Error("SdkWebAPI.updateProperty value parameter must not be null or undefined.");
        }
        if (!isFunctionOrNull(successCallback)) {
            throw new Error("SdkWebAPI.updateProperty successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallback)) {
            throw new Error("SdkWebAPI.updateProperty errorCallback parameter must be a function or null.");
        }
        if (!isAcceptableCallerId(callerId)) {
            throw new Error("SdkWebAPI.updateProperty callerId parameter must be a string or null.");
        }
        var req = new XMLHttpRequest();
        req.open("PUT", encodeURI(uri + "/" + propertyName), true);
        req.setRequestHeader("Accept", "application/json");
        if (callerId) {
            req.setRequestHeader("MSCRMCallerID", callerId);
        }
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                if (this.status == 204) {
                    if (successCallback)
                        successCallback();
                }
                else {
                    if (errorCallback)
                        errorCallback(SdkWebAPI.errorHandler(this), "Update Property Value");
                }
            }
        };
        var updateObject = {};
        updateObject.value = value;
        req.send(JSON.stringify(updateObject));

    }
    SdkWebAPI.upsert = function (uri, entity, preventCreate, preventUpdate, successCallback, errorCallback, callerId) {
        /// <summary>Upsert an entity</summary>
        /// <param name="uri" type="String">The Uri for the entity you want to create or update</param>
        /// <param name="entity" type="Object">An object that contains updated properties for the entity.</param>
        /// <param name="preventCreate" type="Boolean">Whether you want to prevent creating a new entity.</param>
        /// <param name="preventUpdate" type="Boolean">Whether you want to prevent updating an existing entity.</param>
        /// <param name="successCallback" type="Function">The function to call when the operation is performed</param>
        /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
        /// <param name="callerId" type="String" optional="true" optional="true">The systemuserid value of the user to impersonate</param>
        if (!isString(uri)) {
            throw new Error("SdkWebAPI.upsert uri parameter must be a string.");
        }
        if (isNullOrUndefined(entity)) {
            throw new Error("SdkWebAPI.upsert updatedEntity parameter must not be null or undefined.");
        }
        if (!isBooleanOrNull(preventCreate)) {
            throw new Error("SdkWebAPI.upsert preventCreate parameter must be boolean or null.");
        }
        if (!isBooleanOrNull(preventUpdate)) {
            throw new Error("SdkWebAPI.upsert preventUpdate parameter must be boolean or null.");
        }
        if (!isFunctionOrNull(successCallback)) {
            throw new Error("SdkWebAPI.upsert successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallback)) {
            throw new Error("SdkWebAPI.upsert errorCallback parameter must be a function or null.");
        }
        if (!isAcceptableCallerId(callerId)) {
            throw new Error("SdkWebAPI.upsert callerId parameter must be a string or null.");
        }
        if (!(preventCreate && preventUpdate)) {
            var req = new XMLHttpRequest();
            req.open("PATCH", encodeURI(uri), true);
            req.setRequestHeader("Accept", "application/json");
            if (callerId) {
                req.setRequestHeader("MSCRMCallerID", callerId);
            }
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            if (preventCreate) {
                req.setRequestHeader("If-Match", "*");
            }
            if (preventUpdate) {
                req.setRequestHeader("If-None-Match", "*");
            }
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    req.onreadystatechange = null;
                    switch (this.status) {
                        case 204:
                            if (successCallback)
                                successCallback(this.getResponseHeader("OData-EntityId"));
                            break;
                        case 412:
                            if (preventUpdate) {
                                if (successCallback)
                                    successCallback(); //Update prevented
                            }
                            else {
                                if (errorCallback)
                                    errorCallback(SdkWebAPI.errorHandler(this), "Upsert - Status 404");
                            }
                            break;
                        case 404:
                            if (preventCreate) {
                                if (successCallback)
                                    successCallback(); //Create prevented
                            }
                            else {
                                if (errorCallback)
                                    errorCallback(SdkWebAPI.errorHandler(this), "Upsert - Status 404");
                            }
                            break;
                        default:
                            if (errorCallback)
                                errorCallback(SdkWebAPI.errorHandler(this), "Upsert");
                            break;

                    }
                }
            };
            req.send(JSON.stringify(entity));
        }
        else {
            console.log("SdkWebAPI.upsert performed no action because both preventCreate and preventUpdate parameters were true.");
        }
    }
    SdkWebAPI.del = function (uri, successCallback, errorCallback, passthroughObj, passthroughObj1, callerId) {
        /// <summary>Delete an entity</summary>
        /// <param name="uri" type="String">The Uri for the entity you want to delete</param>        
        /// <param name="successCallback" type="Function">The function to call when the entity is deleted.</param>
        /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
        /// <param name="callerId" type="String" optional="true" optional="true">The systemuserid value of the user to impersonate</param>
        if (!isString(uri)) {
            throw new Error("SdkWebAPI.del uri parameter must be a string.");
        }
        if (!isFunctionOrNullOrUndefined(successCallback)) {
            throw new Error("SdkWebAPI.del successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNullOrUndefined(errorCallback)) {
            throw new Error("SdkWebAPI.del errorCallback parameter must be a function or null.");
        }
        if (!isAcceptableCallerId(callerId)) {
            throw new Error("SdkWebAPI.del callerId parameter must be a string or null.");
        }

        var async = !!successCallback;

        var req = new XMLHttpRequest();
        req.open("DELETE", encodeURI(uri), async);
        req.setRequestHeader("Accept", "application/json");
        if (callerId) {
            req.setRequestHeader("MSCRMCallerID", callerId);
        }
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        if (async) {
            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    req.onreadystatechange = null;
                    if (this.status == 204) {
                        if (successCallback)
                            successCallback(this.response, passthroughObj, passthroughObj1);
                    }
                    else {
                        if (errorCallback)
                            errorCallback(SdkWebAPI.errorHandler(this), "Delete Record");
                    }
                }
            };
        }
        req.send();
        if (!async) {
            return req.response;
        }
    }
    SdkWebAPI.deletePropertyValue = function (uri, propertyName, successCallback, errorCallback, callerId) {
        /// <summary>Delete an entity property value</summary>
        /// <param name="uri" type="String">The Uri for the entity you want to update</param>
        /// <param name="propertyName" type="String">The name of the property value you want to delete</param>        
        /// <param name="successCallback" type="Function">The function to call when the entity property is deleted.</param>
        /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
        /// <param name="callerId" type="String" optional="true" optional="true">The systemuserid value of the user to impersonate</param>
        if (!isString(uri)) {
            throw new Error("SdkWebAPI.deletePropertyValue uri parameter must be a string.");
        }
        if (!isString(propertyName)) {
            throw new Error("SdkWebAPI.deletePropertyValue propertyName parameter must be a string.");
        }
        if (!isFunctionOrNull(successCallback)) {
            throw new Error("SdkWebAPI.deletePropertyValue successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallback)) {
            throw new Error("SdkWebAPI.deletePropertyValue errorCallback parameter must be a function or null.");
        }
        if (!isAcceptableCallerId(callerId)) {
            throw new Error("SdkWebAPI.deletePropertyValue callerId parameter must be a string or null.");
        }
        var req = new XMLHttpRequest();
        req.open("DELETE", encodeURI(uri + "/" + propertyName), true);
        req.setRequestHeader("Accept", "application/json");
        if (callerId) {
            req.setRequestHeader("MSCRMCallerID", callerId);
        }
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                if (this.status == 204) {
                    if (successCallback)
                        successCallback();
                }
                else {
                    if (errorCallback)
                        errorCallback(SdkWebAPI.errorHandler(this), "Delete Property Value");
                }
            }
        };
        req.send();
    }

    SdkWebAPI.executeGet = function (uri, properties, filters, includeFormattedValues, successCallback, errorCallback) {
        if (!isString(uri)) {
            throw new Error("SdkWebAPI.executeGet uri parameter must be a string.");
        }
        if (!isStringOrNull(filters)) {
            throw new Error("SdkWebAPI.executeGet filters parameter must be null or string.");
        }
        if (!isStringArrayOrNull(properties)) {
            throw new Error("SdkWebAPI.executeGet properties parameter must be an array of strings or null.");
        }
        if (!isFunctionOrNull(successCallback)) {
            throw new Error("SdkWebAPI.executeGet successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallback)) {
            throw new Error("SdkWebAPI.executeGet errorCallback parameter must be a function or null.");
        }
        if (!isBooleanOrNullOrUndefined(includeFormattedValues)) {
            throw new Error("SdkWebAPI.executeGet includeFormattedValues parameter must be a boolean, null, or undefined.");
        }

        uri += "?$select=" + properties.join();
        uri += '&$filter=' + filters;

        var req = new XMLHttpRequest();
        req.open("GET", encodeURI(uri).replace(/'/g, "%27"), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        if (includeFormattedValues) {
            req.setRequestHeader("Prefer", "odata.include-annotations=\"OData.Community.Display.V1.FormattedValue\"");
        }

        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                switch (this.status) {
                    case 200:
                        if (successCallback)
                            successCallback(JSON.parse(this.response).value);
                        break;
                    case 304: //Not modified
                        if (isFunction(unmodifiedCallback))
                            unmodifiedCallback();
                        break;
                    default:
                        if (errorCallback)
                            errorCallback(SdkWebAPI.errorHandler(this), "Retrieve Entity Properties");
                        break;
                }
            }
        };
        req.send();
    }

    SdkWebAPI.associate = function (parentUri, navigationPropertyName, childUri, successCallback, errorCallback, callerId) {
        /// <summary>Associate an entity</summary>
        /// <param name="parentUri" type="String">The Uri for the entity you want to associate another entity to.</param>
        /// <param name="navigationPropertyName" type="String">The name of the navigation property you want to use to associate the entities.</param>
        /// <param name="childUri" type="String">The Uri for the entity you want to associate with the parent entity.</param>        
        /// <param name="successCallback" type="Function">The function to call when the entities are associated.</param>
        /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
        /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
        if (!isString(parentUri)) {
            throw new Error("SdkWebAPI.associate parentUri parameter must be a string.");
        }
        if (!isString(navigationPropertyName)) {
            throw new Error("SdkWebAPI.associate navigationPropertyName parameter must be a string.");
        }
        if (!isString(childUri)) {
            throw new Error("SdkWebAPI.associate childUri parameter must be a string.");
        }
        if (!isFunctionOrNull(successCallback)) {
            throw new Error("SdkWebAPI.associate successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallback)) {
            throw new Error("SdkWebAPI.associate errorCallback parameter must be a function or null.");
        }
        if (!isAcceptableCallerId(callerId)) {
            throw new Error("SdkWebAPI.associate callerId parameter must be a string or null.");
        }
        var req = new XMLHttpRequest();
        req.open("POST", encodeURI(parentUri + "/" + navigationPropertyName + "/$ref"), true);
        req.setRequestHeader("Accept", "application/json");
        if (callerId) {
            req.setRequestHeader("MSCRMCallerID", callerId);
        }
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                if (this.status == 204) {
                    if (successCallback)
                        successCallback();
                }
                else {
                    if (errorCallback)
                        errorCallback(SdkWebAPI.errorHandler(this), "Associate");
                }
            }
        };
        var rel = {};
        rel["@odata.id"] = childUri;
        req.send(JSON.stringify(rel))
    }
    SdkWebAPI.disassociate = function (parentUri, navigationPropertyName, childUri, successCallback, errorCallback, callerId) {
        /// <summary>Disassociate an entity</summary>
        /// <param name="parentUri" type="String">The Uri for the parent entity.</param>
        /// <param name="navigationPropertyName" type="String">The name of the collection navigation property you want to use to disassociate the entities.</param>
        /// <param name="childUri" type="String">The Uri for the entity you want to disassociate with the parent entity.</param>
        /// <param name="successCallback" type="Function">The function to call when the entities are disassociated.</param>
        /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
        /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
        if (!isString(parentUri)) {
            throw new Error("SdkWebAPI.disassociate parentUri parameter must be a string.");
        }
        if (!isString(navigationPropertyName)) {
            throw new Error("SdkWebAPI.disassociate navigationPropertyName parameter must be a string.");
        }
        if (!isString(childUri)) {
            throw new Error("SdkWebAPI.disassociate childUri parameter must be a string.");
        }
        if (!isFunctionOrNull(successCallback)) {
            throw new Error("SdkWebAPI.disassociate successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallback)) {
            throw new Error("SdkWebAPI.disassociate errorCallback parameter must be a function or null.");
        }
        if (!isAcceptableCallerId(callerId)) {
            throw new Error("SdkWebAPI.disassociate callerId parameter must be a string or null.");
        }
        var req = new XMLHttpRequest();
        req.open("DELETE", encodeURI(parentUri + "/" + navigationPropertyName + "/$ref?$id=" + childUri), true);
        req.setRequestHeader("Accept", "application/json");
        if (callerId) {
            req.setRequestHeader("MSCRMCallerID", callerId);
        }
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                if (this.status == 204) {
                    if (successCallback)
                        successCallback();
                }
                else {
                    if (errorCallback)
                        errorCallback(SdkWebAPI.errorHandler(this), "Disassociate");
                }
            }
        };

        req.send()
    }
    SdkWebAPI.removeReference = function (entityUri, navigationPropertyName, successCallback, errorCallback, passthroughObj, passthroughObj1, callerId) {
        /// <summary>Remove the value of a single-valued navigation property</summary>
        /// <param name="entityUri" type="String">The Uri for the entity.</param>
        /// <param name="navigationPropertyName" type="String">The name of the navigation property you want to use to disassociate the entities.</param>            
        /// <param name="successCallback" type="Function">The function to call when the entities are disassociated.</param>
        /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
        /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
        if (!isString(entityUri)) {
            throw new Error("SdkWebAPI.removeReference entityUri parameter must be a string.");
        }
        if (!isString(navigationPropertyName)) {
            throw new Error("SdkWebAPI.removeReference navigationPropertyName parameter must be a string.");
        }

        if (!isFunctionOrNullOrUndefined(successCallback)) {
            throw new Error("SdkWebAPI.removeReference successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNullOrUndefined(errorCallback)) {
            throw new Error("SdkWebAPI.removeReference errorCallback parameter must be a function or null.");
        }
        if (!isAcceptableCallerId(callerId)) {
            throw new Error("SdkWebAPI.removeReference callerId parameter must be a string or null.");
        }

        var async = !!successCallback;

        var req = new XMLHttpRequest();
        req.open("DELETE", encodeURI(entityUri + "/" + navigationPropertyName + "/$ref"), async);
        req.setRequestHeader("Accept", "application/json");
        if (callerId) {
            req.setRequestHeader("MSCRMCallerID", callerId);
        }
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        if (async) {
            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    req.onreadystatechange = null;
                    if (this.status == 204) {
                        if (successCallback)
                            successCallback(passthroughObj, passthroughObj1);
                    }
                    else {
                        if (errorCallback)
                            errorCallback(SdkWebAPI.errorHandler(this), "Remove Reference");
                    }
                }
            };
        }
        req.send();

        if (!async) {
            return req.response;
        }
    }
    SdkWebAPI.addReference = function (entityUri, navigationPropertyName, referencedEntityUri, successCallback, errorCallback, passthroughObj, passthroughObj1, callerId) {
        /// <summary>Set the value of a single-valued navigation property</summary>
        /// <param name="entityUri" type="String">The Uri for the entity.</param>
        /// <param name="navigationPropertyName" type="String">The name of the navigation property you want to use to associate the entities.</param>     
        /// <param name="referencedEntityUri" type="String">The Uri for the entity you want to associate with the child entity.</param>
        /// <param name="successCallback" type="Function">The function to call when the entities are disassociated.</param>
        /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
        /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
        if (!isString(entityUri)) {
            throw new Error("SdkWebAPI.addReference entityUri parameter must be a string.");
        }
        if (!isString(navigationPropertyName)) {
            throw new Error("SdkWebAPI.addReference navigationPropertyName parameter must be a string.");
        }
        if (!isString(referencedEntityUri)) {
            throw new Error("SdkWebAPI.addReference referencedEntityUri parameter must be a string.");
        }
        if (!isFunctionOrNullOrUndefined(successCallback)) {
            throw new Error("SdkWebAPI.addReference successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNullOrUndefined(errorCallback)) {
            throw new Error("SdkWebAPI.addReference errorCallback parameter must be a function or null.");
        }
        if (!isAcceptableCallerId(callerId)) {
            throw new Error("SdkWebAPI.addReference callerId parameter must be a string or null.");
        }

        var async = !!successCallback;

        var req = new XMLHttpRequest();
        req.open("PUT", encodeURI(entityUri + "/" + navigationPropertyName + "/$ref?"), async);
        req.setRequestHeader("Accept", "application/json");
        if (callerId) {
            req.setRequestHeader("MSCRMCallerID", callerId);
        }
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        if (async) {
            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    req.onreadystatechange = null;
                    if (this.status == 204) {
                        if (successCallback)
                            successCallback(this.response, passthroughObj, passthroughObj1);
                    }
                    else {
                        if (errorCallback)
                            errorCallback(SdkWebAPI.errorHandler(this), "Add Reference");
                    }
                }
            };
        }

        var rel = {};
        rel["@odata.id"] = referencedEntityUri;
        req.send(JSON.stringify(rel));
        if (!async) {
            return req.response;
        }
    }

    SdkWebAPI.invokeBoundFunction = function (entitySetName, functionName, successCallback, errorCallback, callerId) {
        /// <summary>Invoke a bound function</summary>
        /// <param name="entitySetName" type="String">The logical collection name for the entity that the function is bound to.</param>
        /// <param name="functionName" type="String">The name of the bound function you want to invoke</param>        
        /// <param name="successCallback" type="Function">The function to call when the function is invoked. The results of the bound function will be passed to this function.</param>
        /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
        /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
        if (isNullOrUndefined(entitySetName)) {
            throw new Error("SdkWebAPI.invokeBoundFunction entitySetName parameter must not be null or undefined.");
        }
        if (isNullOrUndefined(functionName)) {
            throw new Error("SdkWebAPI.invokeBoundFunction functionName parameter must not be null or undefined.");
        }
        if (!isFunctionOrNull(successCallback)) {
            throw new Error("SdkWebAPI.invokeBoundFunction successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallback)) {
            throw new Error("SdkWebAPI.invokeBoundFunction errorCallback parameter must be a function or null.");
        }
        if (!isAcceptableCallerId(callerId)) {
            throw new Error("SdkWebAPI.invokeBoundFunction callerId parameter must be a string or null.");
        }
        var UriPath = getWebAPIPath() + entitySetName + "/" + functionName + "()";


        var req = new XMLHttpRequest();
        req.open("GET", encodeURI(UriPath), true);
        req.setRequestHeader("Accept", "application/json");
        if (callerId) {
            req.setRequestHeader("MSCRMCallerID", callerId);
        }
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                if (this.status == 200) {
                    if (successCallback)
                        successCallback(JSON.parse(this.response, dateReviver).value);
                }
                else {
                    if (errorCallback)
                        errorCallback(SdkWebAPI.errorHandler(this), "Invoke Bound Function");
                }
            }
        };
        req.send();

    }
    SdkWebAPI.invokeUnboundFunction = function (functionName, parameters, successCallback, errorCallback, callerId) {
        /// <summary>Invoke an unbound function</summary>
        /// <param name="functionName" type="String">The name of the unbound function you want to invoke</param>
        /// <param name="parameters" type="Array">An array of strings representing the parameters to pass to the unbound function</param>
        /// <param name="successCallback" type="Function">The function to call when the function is invoked. The results of the unbound function will be passed to this function.</param>
        /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
        /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
        if (isNullOrUndefined(functionName)) {
            throw new Error("SdkWebAPI.invokeUnboundFunction functionName parameter must not be null or undefined.");
        }
        if (!isStringArrayOrNull(parameters)) {
            throw new Error("SdkWebAPI.retrieve parameters parameter must be an array of strings or null.");
        }
        if (!isFunctionOrNull(successCallback)) {
            throw new Error("SdkWebAPI.invokeUnboundFunction successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallback)) {
            throw new Error("SdkWebAPI.invokeUnboundFunction errorCallback parameter must be a function or null.");
        }
        if (!isAcceptableCallerId(callerId)) {
            throw new Error("SdkWebAPI.invokeUnboundFunction callerId parameter must be a string or null.");
        }

        var UriPath = getWebAPIPath() + functionName;
        var parameterNames = [];
        var parameterAliasValues = [];
        var parameterNumber = 1;
        if (parameters) {
            parameters.forEach(function (param) {
                var keyValue = param.split("=");
                var name = keyValue[0];
                var value = keyValue[1];
                parameterNames.push(name + "=" + "@p" + parameterNumber.toString());
                parameterAliasValues.push("@p" + parameterNumber.toString() + "=" + value)

                parameterNumber++;
            });
            UriPath = UriPath + "(" + parameterNames.join(",") + ")?" + parameterAliasValues.join("&");
        }
        else {
            UriPath = UriPath + "()";
        }

        // The filter array available to filter which data is retrieved. Case Sensitive filters [Entity,Attributes,Privileges,Relationships]
        // Call unbound function RetrieveAllEntities passing EntityFilters ('Entity', enum value 1) and RetrieveAsIfPublished as true or false parameters
        // ["EntityFilters=Microsoft.Dynamics.CRM.EntityFilters'Entity'", "RetrieveAsIfPublished=true"]
        // https://technet.microsoft.com/en-us/library/mt683536
        // calling functions
        // https://msdn.microsoft.com/en-us/library/gg309638.aspx
        // https://community.dynamics.com/crm/b/nishantranaweblog/archive/2016/10/28/passing-enumtype-parameter-in-web-api-in-crm-2016

        var req = new XMLHttpRequest();
        req.open("GET", encodeURI(UriPath), true);
        req.setRequestHeader("Accept", "application/json");
        if (callerId) {
            req.setRequestHeader("MSCRMCallerID", callerId);
        }
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                if (this.status == 200) {
                    if (successCallback)
                        successCallback(JSON.parse(this.response, dateReviver));
                } else if (this.status == 404) {
                    if (errorCallback)
                        errorCallback(new Error("Status Code: 404, Function: " + functionName + ' Not Found'), "Invoke Unbound Function");
                } else {
                    if (errorCallback)
                        errorCallback(SdkWebAPI.errorHandler(this), "Invoke Unbound Function");
                }
            }
        };
        req.send();
    }
    SdkWebAPI.invokeUnboundAction = function (actionName, parameterObj, successCallback, errorCallback, callerId) {
        /// <summary>Invoke an unbound action</summary>
        /// <param name="actionName" type="String">The name of the unbound action you want to invoke.</param>
        /// <param name="parameterObj" type="Object">An object that defines parameters expected by the action</param>        
        /// <param name="successCallback" type="Function">The function to call when the action is invoked. The results of the action will be passed to this function.</param>
        /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
        /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
        if (!isString(actionName)) {
            throw new Error("SdkWebAPI.invokeUnboundAction actionName parameter must be a string.");
        }
        if (isUndefined(parameterObj)) {
            throw new Error("SdkWebAPI.invokeUnboundAction parameterObj parameter must not be undefined.");
        }
        if (!isFunctionOrNull(successCallback)) {
            throw new Error("SdkWebAPI.invokeUnboundAction successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallback)) {
            throw new Error("SdkWebAPI.invokeUnboundAction errorCallback parameter must be a function or null.");
        }
        if (!isAcceptableCallerId(callerId)) {
            throw new Error("SdkWebAPI.invokeUnboundAction callerId parameter must be a string or null.");
        }

        /*
         Invoke Action with custom parameters
         Action name new_TestAction
    var parameterObj = { 
        "Description": "Test description", 
        "Subject": "Invoking from Web API" 
    };
    actionName = "accounts(DE57510E-59A3-E511-80E4-3863BB35AD90)/Microsoft.Dynamics.CRM.new_TestAction"; 
         */

        var req = new XMLHttpRequest();
        req.open("POST", encodeURI(getWebAPIPath() + actionName), true);
        req.setRequestHeader("Accept", "application/json");
        if (callerId) {
            req.setRequestHeader("MSCRMCallerID", callerId);
        }
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                if (this.status == 200 || this.status == 201 || this.status == 204) {
                    if (successCallback) {
                        switch (this.status) {
                            case 200:
                                //When the Action returns a value
                                successCallback(JSON.parse(this.response, dateReviver));
                                break;
                            case 201:
                            case 204:
                                //When the Action does not return a value
                                successCallback();
                                break;
                            default:
                                //Should not happen
                                break;
                        }
                    }
                }
                else {
                    console.log("ERROR Publishing.");
                    if (errorCallback) {
                        errorCallback(SdkWebAPI.errorHandler(this), "Invoke Unbound Action");
                    }
                }
            }
        };
        if (parameterObj) {
            req.send(JSON.stringify(parameterObj));
        }
        else {
            req.send();
        }
    }

    SdkWebAPI.queryEntitySet = function (entitySetName, query, includeFormattedValues, maxPageSize, successCallback, errorCallback) {
        /// <summary>Retrieve multiple entities</summary>
        /// <param name="entitySetName" type="String">The logical collection name for the type of entity you want to retrieve.</param>
        /// <param name="query" type="String">The system query parameters you want to apply.</param> 
        /// <param name="includeFormattedValues" type="Boolean">Whether you want to have formatted values included in the results</param> 
        /// <param name="maxPageSize" type="Number">A number that limits the number of entities to be retrieved in the query.</param> 
        /// <param name="successCallback" type="Function">The function to call when the entities are returned. The results of the query will be passed to this function.</param>
        /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
        /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
        if (!isString(entitySetName)) {
            throw new Error("SdkWebAPI.queryEntitySet entitySetName parameter must be a string.");
        }
        if (!isStringOrNull(query)) {
            throw new Error("SdkWebAPI.queryEntitySet query parameter must be a string or null.");
        }
        if (!isBooleanOrNull(includeFormattedValues)) {
            throw new Error("SdkWebAPI.queryEntitySet includeFormattedValues parameter must be a boolean or null.");
        }
        if (!isNumberOrNull(maxPageSize)) {
            throw new Error("SdkWebAPI.queryEntitySet maxPageSize parameter must be a number or null.");
        }
        if (!isFunctionOrNullOrUndefined(successCallback)) {
            throw new Error("SdkWebAPI.queryEntitySet successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNullOrUndefined(errorCallback)) {
            throw new Error("SdkWebAPI.queryEntitySet errorCallback parameter must be a function or null.");
        }

        var url = getWebAPIPath() + entitySetName;
        if (query) {
            url = url + "?" + query;
        }

        var async = !!successCallback;

        var req = new XMLHttpRequest();
        req.open("GET", encodeURI(url), async);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        if (includeFormattedValues && maxPageSize) {
            req.setRequestHeader("Prefer", "odata.include-annotations=\"OData.Community.Display.V1.FormattedValue\",odata.maxpagesize=" + maxPageSize);
            //req.setRequestHeader("Prefer", "odata.include-annotations=\"mscrm.formattedvalue\",odata.maxpagesize=" + maxPageSize);
        }
        else {
            if (includeFormattedValues) {
                req.setRequestHeader("Prefer", "odata.include-annotations=\"OData.Community.Display.V1.FormattedValue\"");
                //req.setRequestHeader("Prefer", "odata.include-annotations=\"mscrm.formattedvalue\"");
            }

            if (maxPageSize) {
                req.setRequestHeader("Prefer", "odata.maxpagesize=" + maxPageSize);
            }
        }

        if (async) {
            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    req.onreadystatechange = null;
                    if (this.status == 200) {
                        if (successCallback)
                            successCallback(JSON.parse(this.response, dateReviver));
                    }
                    else {
                        if (errorCallback)
                            errorCallback(SdkWebAPI.errorHandler(this), "Query EntitySet");
                    }
                }
            };
        }
        req.send();
        if (!async) {
            if (req.response) {
                try {
                    if (req.status == 200) {
                        var val = JSON.parse(req.response, dateReviver);
                        return val;
                    } else {
                        throw Error(SdkWebAPI.errorHandler(req));
                    }
                } catch (e) {
                    throw Error('queryEntitySet Webapi response processing error\r\n' + e.message);
                }
            } else {
                console.error('queryEntitySet: Error. No response received from server.')
            }
        }

    }
    SdkWebAPI.getNextPage = function (query, includeFormattedValues, maxPageSize, successCallback, errorCallback, callerId) {
        /// <summary>Return the next page of a retrieve multiple query when there are additional pages.</summary>
        /// <param name="query" type="String">The value of the @odata.nextLink property for the results of a queryEntitySet query when there are more pages.</param>
        /// <param name="includeFormattedValues" type="Boolean">Whether you want to have formatted values included in the results</param> 
        /// <param name="maxPageSize" type="Number">A number that limits the number of entities to be retrieved in the query.</param> 
        /// <param name="successCallback" type="Function">The function to call when the entities are returned. The results of the query will be passed to this function.</param>
        /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
        /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
        if (!isStringOrNull(query)) {
            throw new Error("SdkWebAPI.getNextPage query parameter must be a string or null.");
        }
        if (!isBooleanOrNull(includeFormattedValues)) {
            throw new Error("SdkWebAPI.getNextPage includeFormattedValues parameter must be a boolean or null.");
        }
        if (!isNumberOrNull(maxPageSize)) {
            throw new Error("SdkWebAPI.getNextPage maxPageSize parameter must be a number or null.");
        }
        if (!isFunctionOrNull(successCallback)) {
            throw new Error("SdkWebAPI.getNextPage successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallback)) {
            throw new Error("SdkWebAPI.getNextPage errorCallback parameter must be a function or null.");
        }
        if (!isAcceptableCallerId(callerId)) {
            throw new Error("SdkWebAPI.getNextPage callerId parameter must be a string or null.");
        }
        var req = new XMLHttpRequest();
        //Not encoding the URI because it came from the system
        req.open("GET", query, true);
        req.setRequestHeader("Accept", "application/json");
        if (callerId) {
            req.setRequestHeader("MSCRMCallerID", callerId);
        }
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        if (includeFormattedValues) {
            req.setRequestHeader("Prefer", "odata.include-annotations=\"OData.Community.Display.V1.FormattedValue\"");
            //req.setRequestHeader("Prefer", "odata.include-annotations=\"mscrm.formattedvalue\"");
        }

        if (maxPageSize) {
            req.setRequestHeader("Prefer", "odata.maxpagesize=" + maxPageSize);
        }

        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                if (this.status == 200) {
                    if (successCallback)
                        successCallback(JSON.parse(this.response, dateReviver));
                }
                else {
                    if (errorCallback)
                        errorCallback(SdkWebAPI.errorHandler(this), "Get Next Page");
                }
            }
        };
        req.send();
    }

    SdkWebAPI.executeBatch = function (payload, batchId, successCallback, errorCallback, passthroughObj, passthroughObj1, callerId) {
        /// <summary>Execute several operations at once</summary>
        /// <param name="payload" type="String">A string describing the operations to perform in the batch</param>  
        /// <param name="batchId" type="String">A string containing the Id used for the batch</param>   
        /// <param name="successCallback" type="Function">The function to call when the actions are completed. The results of the operation will be passed to this function.</param>
        /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
        /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
        if (!isString(payload)) {
            throw new Error("SdkWebAPI.executeBatch payload parameter must be a string.");
        }
        if (!isString(batchId)) {
            throw new Error("SdkWebAPI.executeBatch batchId parameter must be a string.");
        }
        if (!isFunctionOrNull(successCallback)) {
            throw new Error("SdkWebAPI.executeBatch successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallback)) {
            throw new Error("SdkWebAPI.executeBatch errorCallback parameter must be a function or null.");
        }
        if (!isAcceptableCallerId(callerId)) {
            throw new Error("SdkWebAPI.executeBatch callerId parameter must be a string or null.");
        }

        var req = new XMLHttpRequest();
        req.open("POST", encodeURI(getWebAPIPath() + "$batch"), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "multipart/mixed;boundary=batch_" + batchId);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");

        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                if (this.status == 200) {
                    if (successCallback) {
                        successCallback(this.response, passthroughObj, passthroughObj1);
                    }
                }
                else {
                    if (errorCallback)
                        errorCallback(SdkWebAPI.errorHandler(this), "Execute Batch");
                }
            }
        };
        /*

--batch_nFKxO2Sh7f
Content-Type: multipart/mixed;boundary=changeset_0XCJEeCtmk

--changeset_0XCJEeCtmk
Content-Type: application/http
Content-Transfer-Encoding:binary
Content-ID: 1

PATCH http://127.0.0.1/Grid/api/data/v8.2/contacts(http://127.0.0.1/Grid/api/data/v8.2/contacts(319bbfa9-1e47-e711-80fe-08002738aa19)) HTTP/1.1
Content-Type:application/json;type=entry

{"creditlimit":50}
--changeset_0XCJEeCtmk
Content-Type: application/http
Content-Transfer-Encoding:binary
Content-ID: 2

PATCH http://127.0.0.1/Grid/api/data/v8.2/contacts(http://127.0.0.1/Grid/api/data/v8.2/contacts(319bbfa9-1e47-e711-80fe-08002738aa19)) HTTP/1.1
Content-Type:application/json;type=entry

{"paymenttermscode":2}
--changeset_0XCJEeCtmk--
--batch_nFKxO2Sh7f


--batchresponse_a0de2b5b-e8ac-4193-a8d2-fda581fdc719
Content-Type: multipart/mixed; boundary=changesetresponse_e35e4000-1a4d-492d-a839-6eb608f5cf74

--changesetresponse_e35e4000-1a4d-492d-a839-6eb608f5cf74
Content-Type: application/http
Content-Transfer-Encoding: binary
Content-ID: 1

HTTP/1.1 400 Bad Request
Access-Control-Expose-Headers: Preference-Applied,OData-EntityId,Location,ETag,OData-Version,Content-Encoding,Transfer-Encoding,Content-Length,Retry-After
Content-Type: application/json; odata.metadata=minimal
OData-Version: 4.0

{
  "error":{
    "code":"","message":"Bad Request - Error in query syntax.","innererror":{
      "message":"Bad Request - Error in query syntax.","type":"Microsoft.OData.Core.ODataException","stacktrace":"   at Microsoft.OData.Core.UriParser.Parsers.ODataPathParser.ExtractSegmentIdentifierAndParenthesisExpression(String segmentText, String& identifier, String& parenthesisExpression)\r\n   at Microsoft.OData.Core.UriParser.Parsers.ODataPathParser.CreateFirstSegment(String segmentText)\r\n   at Microsoft.OData.Core.UriParser.Parsers.ODataPathParser.ParsePath(ICollection`1 segments)\r\n   at Microsoft.OData.Core.UriParser.Parsers.ODataPathFactory.BindPath(ICollection`1 segments, ODataUriParserConfiguration configuration)\r\n   at Microsoft.OData.Core.UriParser.ODataUriParser.Initialize()\r\n   at System.Web.OData.Routing.DefaultODataPathHandler.Parse(IEdmModel model, String serviceRoot, String odataPath, ODataUriResolverSetttings resolverSettings, Boolean enableUriTemplateParsing)\r\n   at System.Web.OData.Routing.DefaultODataPathHandler.Parse(IEdmModel model, String serviceRoot, String odataPath)\r\n   at Microsoft.Crm.Extensibility.OData.CrmODataPathHandler.Parse(IEdmModel model, String serviceRoot, String odataPath)"
    }
  }
}
--changesetresponse_e35e4000-1a4d-492d-a839-6eb608f5cf74--
--batchresponse_a0de2b5b-e8ac-4193-a8d2-fda581fdc719--
         */
        req.send(payload);
    }

    SdkWebAPI.getEntityList = function (successCallback, errorCallback, wantFields) {
        /// <summary>Retrieve an array of entities available from the service</summary>
        /// <param name="successCallback" type="Function">The function to call when the results are returned. The results of the operation will be passed to this function.</param>
        /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
        if (!isFunctionOrNull(successCallback)) {
            throw new Error("SdkWebAPI.getEntityList successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallback)) {
            throw new Error("SdkWebAPI.getEntityList errorCallback parameter must be a function or null.");
        }

        var uri = getWebAPIPath();
        if (wantFields) {
            uri += '$metadata';
        }

        var req = new XMLHttpRequest();
        req.open("GET", encodeURI(uri), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                if (this.status == 200) {
                    if (successCallback)
                        successCallback(JSON.parse(this.response).value);
                }
                else {
                    if (errorCallback)
                        errorCallback(SdkWebAPI.errorHandler(this), "Get Entity List");
                }
            }
        };
        req.send();
    }
    SdkWebAPI.getEntityCount = function (entitySetName, successCallback, errorCallback, onlyActive) {
        if (!isString(entitySetName)) {
            throw new Error("SdkWebAPI.queryEntitySet entitySetName parameter must be a string.");
        }
        if (!isFunctionOrNull(successCallback)) {
            throw new Error("SdkWebAPI.queryEntitySet successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallback)) {
            throw new Error("SdkWebAPI.queryEntitySet errorCallback parameter must be a function or null.");
        }

        var url = getWebAPIPath() + entitySetName + '?' + ((onlyActive) ? '$filter=statecode eq 0&' : '') + '$count';
        var req = new XMLHttpRequest();
        req.open("GET", encodeURI(url), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");

        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                if (this.status == 200) {
                    if (successCallback)
                        successCallback(JSON.parse(this.response));
                }
                else {
                    if (errorCallback)
                        errorCallback(SdkWebAPI.errorHandler(this), "Get Entity Count");
                }
            }
        };
        req.send();
    }

    SdkWebAPI.getUserSetttings = function (UserId, successCallback, errorCallback) {
        var prop = ["dateformatstring",
                         "dateseparator",
                         "timeformatstring",
                         "timeseparator",
                         "uilanguageid",
                         "defaultcountrycode",
                         "currencysymbol",
                         "numberseparator",
                         "decimalsymbol",
                         //"currencydecimalprecision",
                         "numbergroupformat",
                         "currencyformatcode",
                         "negativeformatcode",
                         "negativecurrencyformatcode"];

        if (SDKWEBAPI_APIVERSION_USERD < 9) {
            prop.push("currencydecimalprecision");
        }
        // for v9, will use the following
        // SDKWEBAPI_GLOBALCONTEXT.organizationSettings.attributes['currencyDecimalPrecision']
        var url = getWebAPIPath() + 'usersettingscollection?$select=' + prop.join() + '&$filter=systemuserid eq ' + UserId;

        var req = new XMLHttpRequest();
        req.open("GET", encodeURI(url), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");

        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                switch (this.status) {
                    case 200:
                        if (successCallback)
                            successCallback(JSON.parse(this.response).value);
                        break;
                    default:
                        if (errorCallback)
                            errorCallback(SdkWebAPI.errorHandler(this), "Get User Setttings");
                        break;
                }
            }
        };
        req.send();
    }

    SdkWebAPI.GetEntityMetadata = function (entityLogicalName, successCallback, errorCallback) {
        if (!isString(entityLogicalName)) {
            throw new Error("SdkWebAPI.GetEntityInformation entitySetName parameter must be a string.");
        }
        if (!isFunctionOrNullOrUndefined(successCallback)) {
            throw new Error("SdkWebAPI.GetEntityInformation successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNullOrUndefined(errorCallback)) {
            throw new Error("SdkWebAPI.GetEntityInformation errorCallback parameter must be a function or null.");
        }

        var async = !!successCallback;

        var url = getWebAPIPath() + "EntityDefinitions?$select=LogicalName,SchemaName,PrimaryIdAttribute,PrimaryNameAttribute,EntitySetName,LogicalCollectionName,ObjectTypeCode,DisplayName"
        + "&$filter=LogicalName eq '" + entityLogicalName + "'";
        //var url = getWebAPIPath() + "EntityDefinitions(LogicalName='" + entityLogicalName + "')";

        var req = new XMLHttpRequest();
        req.open("GET", encodeURI(url), async);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");

        if (async) {
            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    req.onreadystatechange = null;
                    if (this.status == 200) {
                        if (successCallback)
                            successCallback(JSON.parse(this.response).value);
                    }
                    else {
                        if (errorCallback)
                            errorCallback(SdkWebAPI.errorHandler(this), "Get Entity Information");
                    }
                }
            };
        }
        req.send();
        if (!async) {
            return JSON.parse(req.response).value;
        }
    }
    SdkWebAPI.GetEntityAttributes = function (entitySetName, successCallback, errorCallback) {
        if (!isString(entitySetName)) {
            throw new Error("SdkWebAPI.GetEntityAttributes entitySetName parameter must be a string.");
        }
        if (!isFunctionOrNull(successCallback)) {
            throw new Error("SdkWebAPI.GetEntityAttributes successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallback)) {
            throw new Error("SdkWebAPI.GetEntityAttributes errorCallback parameter must be a function or null.");
        }

        // Get Entity metadata specific values (DisplayName,...)
        //var url = getWebAPIPath() + "EntityDefinitions?$select=DisplayName&$filter=SchemaName eq '" + SchemaName + "'";
        // Gets all entity metadata without Attributes and relationships collections
        //var url = getWebAPIPath() + "EntityDefinitions?$filter=SchemaName eq '" + SchemaName + "'";

        // SchemaName 'Account, LogicalName 'account', LogicalCollectionName and EntitySetName 'accounts', 
        // PrimaryIdAttribute 'accountid', PrimaryNameAttribute 'name'

        // TODO
        // Add PartyList AttributeType eq Microsoft.Dynamics.CRM.AttributeTypeCode'PartyList'

        var url = getWebAPIPath() + "EntityDefinitions?$select=LogicalName,SchemaName,PrimaryIdAttribute,PrimaryNameAttribute,EntitySetName,LogicalCollectionName,ObjectTypeCode,DisplayName,IsQuickCreateEnabled"
            + "&$filter=EntitySetName eq '" + entitySetName + "'&$expand=Attributes"
            + "($filter=(AttributeType eq Microsoft.Dynamics.CRM.AttributeTypeCode'Picklist' or"
            + " AttributeType eq Microsoft.Dynamics.CRM.AttributeTypeCode'String' or"
            + " AttributeType eq Microsoft.Dynamics.CRM.AttributeTypeCode'Memo' or"
            + " AttributeType eq Microsoft.Dynamics.CRM.AttributeTypeCode'Lookup' or"
            + " AttributeType eq Microsoft.Dynamics.CRM.AttributeTypeCode'Boolean' or"
            + " AttributeType eq Microsoft.Dynamics.CRM.AttributeTypeCode'Datetime' or"
            + " AttributeType eq Microsoft.Dynamics.CRM.AttributeTypeCode'Integer' or"
            + " AttributeType eq Microsoft.Dynamics.CRM.AttributeTypeCode'Double' or"
            + " AttributeType eq Microsoft.Dynamics.CRM.AttributeTypeCode'Decimal' or"
            + " AttributeType eq Microsoft.Dynamics.CRM.AttributeTypeCode'Money' or"
            + " AttributeType eq Microsoft.Dynamics.CRM.AttributeTypeCode'Customer' or"
            + " AttributeType eq Microsoft.Dynamics.CRM.AttributeTypeCode'Owner' or"
            + " AttributeType eq Microsoft.Dynamics.CRM.AttributeTypeCode'State' or"
            + " AttributeType eq Microsoft.Dynamics.CRM.AttributeTypeCode'Status')"
            + " and AttributeOf eq null" +
            // Excluded
            " and (LogicalName ne 'createdonbehalfby' and"
            + " LogicalName ne 'exchangerate' and"
            + " LogicalName ne 'importsequencenumber' and"
            + " LogicalName ne 'modifiedonbehalfby' and"
            + " LogicalName ne 'overriddencreatedon' and"
            + " LogicalName ne 'owningbusinessunit' and"
            + " LogicalName ne 'owningteam' and"
            + " LogicalName ne 'owninguser' and"
            + " LogicalName ne 'timezoneruleversionnumber' and"
            + " LogicalName ne 'utcconversiontimezonecode' and"
            + " LogicalName ne 'versionnumber'))";

        var req = new XMLHttpRequest();
        req.open("GET", encodeURI(url), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");

        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                if (this.status == 200) {
                    if (successCallback)
                        successCallback(JSON.parse(this.response).value);
                }
                else {
                    if (errorCallback)
                        errorCallback(SdkWebAPI.errorHandler(this), "Get Entity Attributes");
                }
            }
        };
        req.send();
    }

    SdkWebAPI.GetEntityLookupAttributes = function (entitySetName, successCallback, errorCallback) {
        if (!isString(entitySetName)) {
            throw new Error("SdkWebAPI.GetEntityLookupAttributes entitySetName parameter must be a string.");
        }
        if (!isFunctionOrNull(successCallback)) {
            throw new Error("SdkWebAPI.GetEntityLookupAttributes successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallback)) {
            throw new Error("SdkWebAPI.GetEntityLookupAttributes errorCallback parameter must be a function or null.");
        }

        var url = getWebAPIPath() + "EntityDefinitions?$select=LogicalName,SchemaName,PrimaryIdAttribute,PrimaryNameAttribute,EntitySetName,LogicalCollectionName,ObjectTypeCode,DisplayName,IsQuickCreateEnabled"
            + "&$filter=EntitySetName eq '" + entitySetName + "'&$expand=Attributes"
            + "($filter=("
            + " AttributeType eq Microsoft.Dynamics.CRM.AttributeTypeCode'Lookup' or"
            + " AttributeType eq Microsoft.Dynamics.CRM.AttributeTypeCode'Customer' or"
            + " AttributeType eq Microsoft.Dynamics.CRM.AttributeTypeCode'Owner')"
            + " and AttributeOf eq null" +
            // Excluded
            " and (LogicalName ne 'createdonbehalfby' and"
            + " LogicalName ne 'exchangerate' and"
            + " LogicalName ne 'importsequencenumber' and"
            + " LogicalName ne 'modifiedonbehalfby' and"
            + " LogicalName ne 'overriddencreatedon' and"
            + " LogicalName ne 'owningbusinessunit' and"
            + " LogicalName ne 'owningteam' and"
            + " LogicalName ne 'owninguser' and"
            + " LogicalName ne 'timezoneruleversionnumber' and"
            + " LogicalName ne 'utcconversiontimezonecode' and"
            + " LogicalName ne 'versionnumber'))";

        var req = new XMLHttpRequest();
        req.open("GET", encodeURI(url), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");

        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                if (this.status == 200) {
                    if (successCallback)
                        successCallback(JSON.parse(this.response).value);
                }
                else {
                    if (errorCallback)
                        errorCallback(SdkWebAPI.errorHandler(this), "Get Entity Attributes");
                }
            }
        };
        req.send();
    }

    SdkWebAPI.GetEntityAttribute = function (entitySetName, attributeSchemaName, successCallback, errorCallback) {
        if (!isString(entitySetName)) {
            throw new Error("SdkWebAPI.GetEntityAttribute entitySetName parameter must be a string.");
        }
        if (!isString(attributeSchemaName)) {
            throw new Error("SdkWebAPI.GetEntityAttribute attributeSchemaName parameter must be a string.");
        }
        if (!isFunctionOrNull(successCallback)) {
            throw new Error("SdkWebAPI.GetEntityAttribute successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallback)) {
            throw new Error("SdkWebAPI.GetEntityAttribute errorCallback parameter must be a function or null.");
        }

        var url = getWebAPIPath() + "EntityDefinitions?$select=LogicalName"
            + "&$filter=EntitySetName eq '" + entitySetName + "'&$expand=Attributes"
            + "($filter=LogicalName eq '" + attributeSchemaName + "')";

        var req = new XMLHttpRequest();
        req.open("GET", encodeURI(url), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");

        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                if (this.status == 200) {
                    if (successCallback)
                        successCallback(JSON.parse(this.response).value);
                }
                else {
                    if (errorCallback)
                        errorCallback(SdkWebAPI.errorHandler(this), "Get Entity Attribute");
                }
            }
        };
        req.send();
    }
    SdkWebAPI.GetEntityObjectTypeCode = function (entityLogicalName) {
        if (!isString(entityLogicalName)) {
            throw new Error("SdkWebAPI.getEntityObjectTypeCode entityLogicalName parameter must be a string.");
        }

        var url = getWebAPIPath() + "EntityDefinitions?$select=ObjectTypeCode&$filter=LogicalName eq '" + entityLogicalName + "'";

        var req = new XMLHttpRequest();
        req.open("GET", encodeURI(url), false);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.send();
        try {
            return JSON.parse(req.response).value[0].ObjectTypeCode;
        } catch (e) {
            console.error('SdkWebAPI.GetEntityObjectTypeCode parsing response error:\r\n' + e.message);
        }
    }
    // https://msdn.microsoft.com/en-us/library/microsoft.xrm.sdk.metadata.entitymetadata.entitysetname.aspx
    // EntitySetName is used in the resource path for this entity in the Web API.
    // For custom entities, you can change the name of the entity set used.
    // By default it is the same as the LogicalCollectionName. More information: Web API types and operations
    SdkWebAPI.GetEntitySetName = function (entityLogicalName) {
        if (isString(entityLogicalName)) {
            var result = SdkWebAPI.GetEntityMetadata(entityLogicalName);
            var tmp = ((result) && (result.length) && (result.length > 0)) ? result[0] : null;
            if (tmp) {
                return tmp.EntitySetName;
            } else {
                // try best guess
                // usersettings -> usersettingses
                if (entityLogicalName[entityLogicalName.length - 1] == "s" || entityLogicalName[entityLogicalName.length - 1] == "x") {
                    return entityLogicalName + "es";
                    // transactioncurrency
                } else if (entityLogicalName[entityLogicalName.length - 1] == "y") {
                    return entityLogicalName.substr(0, entityLogicalName.length - 1) + "ies";
                    // account -> accounts
                } else {
                    return entityLogicalName + "s";
                }
            }
        } else {
            throw new Error('SdkWebAPI.GetEntitySetName::entityLogicalName must have a value.');
        }
        return "";
    }
    SdkWebAPI.retrieveEntityMetadata = function (entitySetName, successCallback, errorCallback) {
        var async = !!successCallback;

        var url = getWebAPIPath() + "EntityDefinitions?$select=LogicalName"
            + "&$filter=EntitySetName eq '" + entitySetName + "'";

        var req = new XMLHttpRequest();
        req.open("GET", encodeURI(url), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        if (async) {
            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    req.onreadystatechange = null;
                    if (this.status == 200) {
                        if (successCallback)
                            successCallback(JSON.parse(this.response).value);
                    }
                    else {
                        if (errorCallback)
                            errorCallback(SdkWebAPI.errorHandler(this), "Get Entity Attribute");
                    }
                }
            };
        }
        req.send();
        if (!async) {
            return JSON.parse(req.response).value;
        }
    }
    SdkWebAPI.GetMetaDataId = function (entityLogicalName, attributeLogicalName) {
        var uri = getWebAPIPath() +
            "EntityDefinitions?$select=SchemaName&$filter=LogicalName eq '" + entityLogicalName +
            "'&$expand=Attributes($filter=LogicalName eq '" + attributeLogicalName + "')";

        var req = new XMLHttpRequest();
        req.open("GET", encodeURI(uri), false);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.send();

        var result = JSON.parse(req.response).value[0];
        var ids = { EntityMetaddataId: result.MetadataId, AttributeMetaDataId: result.Attributes[0].MetadataId };

        return ids;
    }
    SdkWebAPI.GetAttributeSchemaName = function (entityLogicalName, attributeLogicalName, successCallback, errorCallback) {
        var uri = getWebAPIPath() +
            "EntityDefinitions?$select=SchemaName&$filter=LogicalName eq '" + entityLogicalName +
            "'&$expand=Attributes($filter=LogicalName eq '" + attributeLogicalName + "')";

        var async = !!successCallback;

        var req = new XMLHttpRequest();
        req.open("GET", encodeURI(uri), false);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");

        if (async) {
            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    req.onreadystatechange = null;
                    if (this.status == 200) {
                        var attrs = JSON.parse(this.response).value[0].Attributes[0];
                        if (attrs.IsCustomAttribute) {
                            successCallback(attrs.SchemaName);
                        } else {
                            // account for system attributes such as primarycontactid (PrimaryContactId) where
                            // using SchemaName as a navigation property will return 400
                            successCallback(attrs.LogicalName);
                        }
                    }
                    else {
                        if (errorCallback)
                            errorCallback(SdkWebAPI.errorHandler(this), "GetAttributeSchemaName");
                    }
                }
            };
        }

        req.send();
        if (!async) {
            var attrs = JSON.parse(req.response).value[0].Attributes[0];
            if (attrs.IsCustomAttribute) {
                return attrs.SchemaName;
            } else {
                // account for system attributes such as primarycontactid (PrimaryContactId) where
                // using SchemaName as a navigation property will return 400
                return attrs.LogicalName;
            }
        }
    }
    // attributeType = {isPicklist: false, isBoolean: false, isState: false, isStatus: false}
    SdkWebAPI.retrieveMetadataByLogicalName = function (entityLogicalName, attributeLogicalName, attributeType, successCallback, errorCallback) {
        if (!isString(entityLogicalName)) {
            throw new Error("SdkWebAPI.retrieveMetadataByLogicalName entitySchemaName parameter must be a string.");
        }
        if (!isString(attributeLogicalName)) {
            throw new Error("SdkWebAPI.retrieveMetadataByLogicalName attributeLogicalName parameter must be a string.");
        }
        if (!isFunctionOrNullOrUndefined(successCallback)) {
            throw new Error("SdkWebAPI.retrieveMetadataByLogicalName successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNullOrUndefined(errorCallback)) {
            throw new Error("SdkWebAPI.retrieveMetadataByLogicalName errorCallback parameter must be a function or null.");
        }

        var async = !!successCallback;
        var uri = null;
        if ((SDKWEBAPI_VERSION_USERD == '8.0') || (SDKWEBAPI_VERSION_USERD == '8.1')) {
            // Get meta data ids and then get the metadata
            var metadataIds = SdkWebAPI.GetMetaDataId(entityLogicalName, attributeLogicalName);

            var atype = null;
            if (attributeType.isPicklist) {
                atype = "Picklist";
            } else if (attributeType.isBoolean) {
                atype = "Boolean";
            } else if (attributeType.isState) {
                atype = "State";
            } else if (attributeType.isStatus) {
                atype = "Status";
            }
            var result = SdkWebAPI.retrieveMetadataByMetadataId(metadataIds.EntityMetaddataId, metadataIds.AttributeMetaDataId, atype, successCallback, errorCallback);
            if (!async) {
                return result;
            }

        } else {
            uri = getWebAPIPath() + "EntityDefinitions(LogicalName='" + entityLogicalName + "')/Attributes(LogicalName='" + attributeLogicalName.toLowerCase() + "')";
            if (attributeType.isPicklist) {
                uri += "/Microsoft.Dynamics.CRM.PicklistAttributeMetadata?$select=LogicalName&$expand=OptionSet($select=Options),GlobalOptionSet($select=Options)";
            } else if (attributeType.isBoolean) {
                uri += "/Microsoft.Dynamics.CRM.BooleanAttributeMetadata?$select=LogicalName&$expand=OptionSet($select=TrueOption,FalseOption)";
            } else if (attributeType.isState) {
                uri += "/Microsoft.Dynamics.CRM.StateAttributeMetadata?$select=LogicalName&$expand=OptionSet($select=Options)";
            } else if (attributeType.isStatus) {
                uri += "/Microsoft.Dynamics.CRM.StatusAttributeMetadata?$select=LogicalName&$expand=OptionSet($select=Options)";
            }

            var req = new XMLHttpRequest();
            req.open("GET", encodeURI(uri), async);
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            if (async) {
                req.onreadystatechange = function () {
                    if (this.readyState == 4 /* complete */) {
                        req.onreadystatechange = null;
                        if (this.status == 200) {
                            successCallback(JSON.parse(this.response));
                        }
                        else {
                            if (errorCallback)
                                errorCallback(SdkWebAPI.errorHandler(this), "Retrieve Metadata By LogicalName");
                        }
                    }
                };
            }
            req.send();
            if (!async) {
                return JSON.parse(req.response);
            }
        }
    }
    SdkWebAPI.retrieveMetadataByMetadataId = function (entityMetadataId, attributMetadataId, attributeType, successCallback, errorCallback) {
        //build query string 
        var uri = getWebAPIPath() + buildQueryString(entityMetadataId, attributMetadataId, attributeType);
        var async = !!successCallback;

        var req = new XMLHttpRequest();
        req.open("GET", uri, async);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        if (async) {
            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    req.onreadystatechange = null;
                    if (this.status == 200) {
                        if (successCallback) {
                            successCallback(JSON.parse(this.response));
                        }
                    }
                    else {
                        if (errorCallback) {
                            errorCallback(SdkWebAPI.errorHandler(this), "Retrieve Metadata By MetadataId");
                        }
                    }
                }
            };
        }
        req.send();
        if (!async) {
            return JSON.parse(req.response);
        }
    }

    SdkWebAPI.getManyToOneRelationships = function (entityLogicalName, successCallback, errorCallback) {
        if (!isString(entityLogicalName)) {
            throw new Error("SdkWebAPI.getManyToOneRelationships entityLogicalName parameter must be a string.");
        }
        if (!isFunctionOrNullOrUndefined(successCallback)) {
            throw new Error("SdkWebAPI.getManyToOneRelationships successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNullOrUndefined(errorCallback)) {
            throw new Error("SdkWebAPI.getManyToOneRelationships errorCallback parameter must be a function or null.");
        }

        var async = !!successCallback;

        // Gets all N:1 relationships
        // Can not use RelationshipDefinitions
        // The properties available when querying RelationshipDefinitions entity set are limited to those in the RelationshipMetadataBase EntityType.
        // OneToManyRelationshipMetadata and ManyToManyRelationshipMetadata
        var url = getWebAPIPath() + "EntityDefinitions?$select=SchemaName&$filter=LogicalName eq '" + entityLogicalName + "'&$expand=ManyToOneRelationships";

        var req = new XMLHttpRequest();
        req.open("GET", encodeURI(url), async);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        if (async) {
            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    req.onreadystatechange = null;
                    if (this.status == 200) {
                        if (successCallback)
                            successCallback(JSON.parse(this.response).value);
                    }
                    else {
                        if (errorCallback)
                            errorCallback(SdkWebAPI.errorHandler(this), "Get ManyToOneRelationships");
                    }
                }
            };
        }
        req.send();
        if (!async) {
            return JSON.parse(req.response).value;
        }
    }
    SdkWebAPI.getOneToManyRelationships = function (referencedEntityLogicalName, referencingEntityLogicalName, successCallback, errorCallback) {
        if (!isString(referencedEntityLogicalName)) {
            throw new Error("SdkWebAPI.getOneToManyRelationships referencedEntityLogicalName parameter must be a string.");
        }
        if (!isStringOrNullOrUndefined(referencingEntity)) {
            throw new Error("SdkWebAPI.getOneToManyRelationships referencingEntity parameter must be a string, null or undefined.");
        }
        if (!isFunctionOrNull(successCallback)) {
            throw new Error("SdkWebAPI.getOneToManyRelationships successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallback)) {
            throw new Error("SdkWebAPI.getOneToManyRelationships errorCallback parameter must be a function or null.");
        }

        var url = getWebAPIPath() + "RelationshipDefinitions/Microsoft.Dynamics.CRM.OneToManyRelationshipMetadata?$select=ReferencingAttribute,ReferencedAttribute&$filter=ReferencedEntity eq '" + referencedEntityLogicalName + "' and ReferencingEntity eq '" + referencingEntityLogicalName + "'";

        var req = new XMLHttpRequest();
        req.open("GET", encodeURI(url), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");

        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                if (this.status == 200) {
                    if (successCallback)
                        successCallback(JSON.parse(this.response).value);
                }
                else {
                    if (errorCallback)
                        errorCallback(SdkWebAPI.errorHandler(this), "Get OneToManyRelationships");
                }
            }
        };
        req.send();
    }

    SdkWebAPI.getFetchXml = function (entitySetName, fetchXml, successCallback, errorCallback, passthroughObj, passthroughObj1) {
        if (isNullOrUndefined(entitySetName)) {
            throw new Error("SdkWebAPI.getFetchXml entitySetName parameter must not be null or undefined.");
        }
        if (!isString(fetchXml)) {
            throw new Error("SdkWebAPI.getFetchXml fetchXml parameter must be a string.");
        }
        if (!isFunctionOrNullOrUndefined(successCallback)) {
            throw new Error("SdkWebAPI.getFetchXml successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNullOrUndefined(errorCallback)) {
            throw new Error("SdkWebAPI.getFetchXml errorCallback parameter must be a function or null.");
        }

        var async = !!successCallback;

        fetchXml = fetchXml.replace(/\"/g, "'");
        var url = getWebAPIPath() + entitySetName + "?fetchXml=" + encodeURIComponent(fetchXml);

        var req = new XMLHttpRequest();
        req.open("GET", url, async);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Prefer", "odata.include-annotations=*");

        if (async) {
            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    req.onreadystatechange = null;
                    switch (this.status) {
                        case 200:
                            if (successCallback) {
                                var hasMoreRecords = false;
                                var pagingCookie = undefined;
                                var val = JSON.parse(this.response);
                                if (val["@Microsoft.Dynamics.CRM.fetchxmlpagingcookie"] != null) {
                                    hasMoreRecords = true;
                                    pagingCookie = val["@Microsoft.Dynamics.CRM.fetchxmlpagingcookie"];
                                }
                                successCallback(val.value, hasMoreRecords, pagingCookie, passthroughObj, passthroughObj1);
                                /*
                    <fetch version="1.0" output-format="xml-platform" mapping="logical" no-lock="true" count="150" page="1" paging-cookie="">
                    <entity name="account">
                    <attribute name="name" />
                    <attribute name="creditlimit" />
                    <attribute name="transactioncurrencyid" />
                    <attribute name="description" />
                    <attribute name="donotpostalmail" />
                    <attribute name="industrycode" />
                    <attribute name="primarycontactid" />
                    <attribute name="websiteurl" />
                    <attribute name="statecode" />
                    <attribute name="statuscode" />
                    <attribute name="accountnumber" />
                    <attribute name="parentaccountid" />
                    <filter type="and"><condition attribute="statecode" operator="eq" value="0" /></filter></entity></fetch>
                    
                    
                    {
                      "@odata.context":"http://127.0.0.1/DemoApi/api/data/v8.0/$metadata#accounts",
                      "value":[
                        {
                          "count@OData.Community.Display.V1.FormattedValue":"11",
                          "count":11
                        }
                      ]
                    }
                    {
                      "@odata.context":"http://127.0.0.1/DemoApi/api/data/v8.0/$metadata#accounts(_primarycontactid…er,donotpostalmail,name,_transactioncurrencyid_value,transactioncurrencyid)",
                      "@Microsoft.Dynamics.CRM.fetchxmlpagingcookie":"<cookie pagenumber=\"2\" pagingcookie=\"%253ccookie%2520page%253d%25221%2522%253e%253caccountid%2520last%253d%2522%257bE211CD25-AA42-E611-80CC-08002738AA19%257d%2522%2520first%253d%2522%257bDA11CD25-AA42-E611-80CC-08002738AA19%257d%2522%2520%252f%253e%253c%252fcookie%253e\" istracking=\"False\" />",
                      "value":[{
                    @odata.etag:"W/"686310""
                    accountid:"da11cd25-aa42-e611-80cc-08002738aa19"
                    accountnumber:"ABSS4G45"
                    creditlimit:54.54
                    creditlimit@OData.Community.Display.V1.FormattedValue:"$54.54"
                    donotpostalmail:falsedonotpostalmail@OData.Community.Display.V1.FormattedValue:"Allow"
                    industrycode:8
                    industrycode@OData.Community.Display.V1.FormattedValue:"Consumer Services"
                    name:"Fourth Coffee (sample)"
                    statecode:0
                    statecode@OData.Community.Display.V1.FormattedValue:"Active"
                    statuscode:1
                    statuscode@OData.Community.Display.V1.FormattedValue:"Active"
                    websiteurl:"http://www.fourthcoffee.com/"
                    
                    _primarycontactid_value:"4012cd25-aa42-e611-80cc-08002738aa19"
                    _primarycontactid_value@Microsoft.Dynamics.CRM.associatednavigationproperty:"primarycontactid"
                    _primarycontactid_value@Microsoft.Dynamics.CRM.lookuplogicalname:"contact"
                    _primarycontactid_value@OData.Community.Display.V1.FormattedValue:"Yvonne McKay (sample)"
                    _transactioncurrencyid_value:"34f2d08b-c23f-e611-80c8-08002738aa19"
                    _transactioncurrencyid_value@Microsoft.Dynamics.CRM.associatednavigationproperty:"transactioncurrencyid"
                    _transactioncurrencyid_value@Microsoft.Dynamics.CRM.lookuplogicalname:"transactioncurrency"
                    _transactioncurrencyid_value@OData.Community.Display.V1.FormattedValue:"Canadian Dollar"
                    _parentaccountid_value:"ea11cd25-aa42-e611-80cc-08002738aa19"
                    _parentaccountid_value@Microsoft.Dynamics.CRM.associatednavigationproperty:"parentaccountid"
                    _parentaccountid_value@Microsoft.Dynamics.CRM.lookuplogicalname:"account"
                    _parentaccountid_value@OData.Community.Display.V1.FormattedValue:"A. Datum Corporation (sample)"
                    }]
                    }
                                 */
                            }
                            break;
                        default:
                            if (errorCallback)
                                errorCallback(SdkWebAPI.errorHandler(this), "Get FetchXml");
                            break;
                    }
                }
            };
        }
        req.send();
        if (!async) {
            var fetchResult = { PagingCookie: null, HasMoreRecords: false, Value: null };
            if (req.response) {
                try {
                    if (req.status == 200) {
                        var val = JSON.parse(req.response);
                        fetchResult.Value = val.value;
                        if (val["@Microsoft.Dynamics.CRM.fetchxmlpagingcookie"] != null) {
                            fetchResult.HasMoreRecords = true;
                            fetchResult.PagingCookie = val["@Microsoft.Dynamics.CRM.fetchxmlpagingcookie"];
                        }
                    } else {
                        throw Error(SdkWebAPI.errorHandler(req));
                    }
                } catch (e) {
                    console.error('getFetchXml Webapi response processing error\r\n' + e.message);
                }
            }
            return fetchResult;
        }
    }

    SdkWebAPI.RetrieveGlobalOptionSetMetaDataId = function (optionSetSchemaName, successCallback, errorCallback) {
        // get all global optionsets
        // "https://contoso.crm.dynamics.com/api/data/v8.2/$metadata#GlobalOptionSetDefinitions/$entity","@odata.type":"#Microsoft.Dynamics.CRM.OptionSetMetadata"
        var globalOptionSetMetaDataId = null;
        var uri = getWebAPIPath() + "GlobalOptionSetDefinitions?$select=Name";

        var req = new XMLHttpRequest();
        req.open("GET", uri, true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.send();

        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                if (req.status == 201 || req.status == 200) {
                    var RetrieveService = JSON.parse(this.response);
                    if ((RetrieveService.value) && (RetrieveService.value.length > 0)) {
                        for (var i = 0; i < RetrieveService.value.length; i++) {
                            if (RetrieveService.value[i].Name == optionSetSchemaName) {
                                globalOptionSetMetaDataId = RetrieveService.value[i].MetadataId;
                                break;
                            }
                        }
                    }
                    if (successCallback) {
                        successCallback(globalOptionSetMetaDataId);
                    }
                }
                else {
                    if (errorCallback)
                        errorCallback(SdkWebAPI.errorHandler(this), "Retrieve Global OptionSetOptions MetaDataId");
                }
            }
        };
    }
    SdkWebAPI.RetrieveGlobalOptionSetOptionsMetaData = function (globalOptionSetMetaDataId, successCallback, errorCallback) {
        if (!isString(globalOptionSetMetaDataId)) {
            throw new Error("SdkWebAPI.RetrieveGlobalOptionSetOptionsMetaData globalOptionSetMetaDataId parameter must be a string.");
        }
        if (!isFunctionOrNull(successCallback)) {
            throw new Error("SdkWebAPI.RetrieveGlobalOptionSetOptionsMetaData successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallback)) {
            throw new Error("SdkWebAPI.RetrieveGlobalOptionSetOptionsMetaData errorCallback parameter must be a function or null.");
        }

        var uri = getWebAPIPath() + "GlobalOptionSetDefinitions(" + globalOptionSetMetaDataId + ")";

        var req = new XMLHttpRequest();
        req.open("GET", uri, true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.send();

        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                if (req.status == 201 || req.status == 200) {
                    if (successCallback)
                        successCallback(JSON.parse(this.response).Options);
                }
                else {
                    if (errorCallback)
                        errorCallback(SdkWebAPI.errorHandler(this), "Retrieve Global OptionSetOptions MetaData");
                }
            }
        };
    }

    SdkWebAPI.SetState = function (uri, statecode, statuscode, successCallback, errorCallback, passthroughObj, passthroughObj1) {
        if (!isString(uri)) {
            throw new Error("SdkWebAPI.SetState uri parameter must be a string.");
        }
        if (!isNumber(statecode)) {
            throw new Error("SdkWebAPI.SetState statecode parameter must be a number.");
        }
        if (!isNumber(statuscode)) {
            throw new Error("SdkWebAPI.SetState statuscode parameter must be a number.");
        }
        if (!isFunctionOrNull(successCallback)) {
            throw new Error("SdkWebAPI.SetState successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallback)) {
            throw new Error("SdkWebAPI.SetState errorCallback parameter must be a function or null.");
        }

        var entity = {};
        entity.statuscode = statuscode;
        entity.statecode = statecode;

        var req = new XMLHttpRequest();
        req.open("PATCH", encodeURI(uri), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");

        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                if (this.status == 204) {
                    if (successCallback)
                        successCallback(passthroughObj, passthroughObj1);
                }
                else {
                    if (errorCallback)
                        errorCallback(SdkWebAPI.errorHandler(this), "Set Record State");
                }
            }
        };
        req.send(JSON.stringify(entity));
    }
    SdkWebAPI.versionNumber = function (successCallback, errorCallback) {
        /// <summary>Retrieve an array of entities available from the service</summary>
        /// <param name="successCallback" type="Function">The function to call when the results are returned. The results of the operation will be passed to this function.</param>
        /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
        if (!isFunctionOrNull(successCallback)) {
            throw new Error("SdkWebAPI.getEntityList successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallback)) {
            throw new Error("SdkWebAPI.getEntityList errorCallback parameter must be a function or null.");
        }

        try {
            var v = null;
            getContext();
            if ((SDKWEBAPI_GLOBALCONTEXT) && (SDKWEBAPI_GLOBALCONTEXT.getVersion) && (isFunction(SDKWEBAPI_GLOBALCONTEXT.getVersion))) {
                v = SDKWEBAPI_GLOBALCONTEXT.getVersion();
            } else {
                v = window.parent["APPLICATION_FULL_VERSION"] + '';
            }
            if (!isNullOrUndefined(v)) {
                if (v.indexOf('.') != -1) {
                    var arr = v.split('.');
                    if (parseInt(arr[0]) >= 8) {
                        SDKWEBAPI_VERSION_USERD = arr[0] + '.' + arr[1];
                        SDKWEBAPI_APIVERSION_USERD = parseInt(arr[0]);
                        successCallback(v);
                    } else {
                        errorCallback(new Error('CRM Version ' + v + ' does not support WebAPI. Using SOAP library.'));
                    }
                    return;
                }
            }
        } catch (e) {
        }
        SdkWebAPI.invokeUnboundFunction("RetrieveVersion", null,
            function VersionFunctionSuccess(VersionResponse) {
                try {
                    var arr = VersionResponse.Version.split('.');
                    SDKWEBAPI_VERSION_USERD = arr[0] + '.' + arr[1];
                    SDKWEBAPI_APIVERSION_USERD = parseInt(arr[0]);
                } catch (e) {
                    console.error(e.message);
                }
                if (successCallback) {
                    successCallback(VersionResponse);
                }
            },
            errorCallback);
    }
    SdkWebAPI.versionNumbersimple = function () {
        try {
            var v = null;
            getContext();
            if ((SDKWEBAPI_GLOBALCONTEXT) && (SDKWEBAPI_GLOBALCONTEXT.getVersion) && (isFunction(SDKWEBAPI_GLOBALCONTEXT.getVersion))) {
                v = SDKWEBAPI_GLOBALCONTEXT.getVersion();
            } else {
                v = window.parent["APPLICATION_FULL_VERSION"] + '';
            }
            if (!isNullOrUndefined(v)) {
                if (v.indexOf('.') != -1) {
                    var arr = v.split('.');
                    if (parseInt(arr[0]) >= 8) {
                        SDKWEBAPI_VERSION_USERD = arr[0] + '.' + arr[1];
                        SDKWEBAPI_APIVERSION_USERD = parseInt(arr[0]);
                    }
                    return;
                }
            }
        } catch (e) {
        }
    }
    SdkWebAPI.whoAmIFunction = function (successCallback, errorCallback) {
        /// <summary>Retrieve an array of entities available from the service</summary>
        /// <param name="successCallback" type="Function">The function to call when the results are returned. The results of the operation will be passed to this function.</param>
        /// <param name="errorCallback" type="Function">The function to call when there is an error. The error will be passed to this function.</param>
        if (!isFunctionOrNull(successCallback)) {
            throw new Error("SdkWebAPI.getEntityList successCallback parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallback)) {
            throw new Error("SdkWebAPI.getEntityList errorCallback parameter must be a function or null.");
        }

        SdkWebAPI.invokeUnboundFunction("WhoAmI", //functionName
         null, //parameters
         successCallback,  //successCallback
         errorCallback); //errorCallback
        /*
function WhoAmIFunctionSuccess(WhoAmIResponse) {
 UserId = WhoAmIResponse.UserId;
 console.log("BusinessUnitId: " + WhoAmIResponse.BusinessUnitId);
 console.log("OrganizationId: " + WhoAmIResponse.OrganizationId);
}
         */
    }

    SdkWebAPI.GetUri = function (entitySetName, Guid) {
        if (!isString(entitySetName)) {
            throw new Error("SdkWebAPI.GetUri entitySetName parameter must be a string.");
        }
        if (!isStringOrNullOrUndefined(Guid)) {
            throw new Error("SdkWebAPI.GetUri Guid parameter must be a string, or null or underfined.");
        }
        var uri = getWebAPIPath() + entitySetName;
        if (Guid) {
            // .replace(/[{}]/g, "")
            uri += "(" + Guid.replace('{', '').replace('}', '') + ")";
        }
        return uri;
    }
    SdkWebAPI.GetIdFromUri = function (uri) {
        if (uri) {
            // uri: http://127.0.0.1/Grid/api/data/v8.1/contacts(7a4b2b54-9c79-e611-80db-08002738aa19)
            // id: 7a4b2b54-9c79-e611-80db-08002738aa19
            // return /\(([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\)/g.exec(uri)[1]);
            return uri.split(/[()]/)[1];
        } else {
            return null;
        }
    }

    // Create batch payload for Update, Delete, and Create
    SdkWebAPI.CreateBatchCreatePayload = function (EntitySetName, requests) {
        //Generate a random set of 10 characters to serve as the batchId value
        var batchId = getRandomId();
        //Generate a random set of 10 characters to serve as the changeSetId value
        var changeSetId = getRandomId();

        var load = { batchId: batchId, payload: null };

        var data = ["--batch_" + batchId]
        data.push("Content-Type: multipart/mixed;boundary=changeset_" + changeSetId);
        data.push("");
        for (var i = 0; i < requests.length; i++) {
            //item in ChangeSet
            data.push("--changeset_" + changeSetId);
            data.push("Content-Type: application/http");
            data.push("Content-Transfer-Encoding:binary");
            data.push("Content-ID: " + (i + 1));
            data.push('');
            data.push('POST ' + EntitySetName + ' HTTP/1.1');
            data.push('Content-Type:application/json;type=entry');
            data.push('');
            data.push(JSON.stringify(requests[i]));
        }
        data.push("--changeset_" + changeSetId + "--");
        data.push("--batch_" + batchId);
        load.payload = data.join('\r\n');

        return load;
    }
    SdkWebAPI.CreateBatchUpdatePayload = function (requests) {
        //Generate a random set of 10 characters to serve as the batchId value
        var batchId = getRandomId();
        //Generate a random set of 10 characters to serve as the changeSetId value
        var changeSetId = getRandomId();

        var load = { batchId: batchId, payload: null };

        var data = ["--batch_" + batchId]
        data.push("Content-Type: multipart/mixed;boundary=changeset_" + changeSetId);
        data.push("");
        for (var i = 0; i < requests.length; i++) {
            //item in ChangeSet
            data.push("--changeset_" + changeSetId);
            data.push("Content-Type: application/http");
            data.push("Content-Transfer-Encoding:binary");
            data.push("Content-ID: " + (i + 1));
            data.push('');
            data.push('PATCH ' + requests[i].Uri + ' HTTP/1.1');
            data.push('Content-Type:application/json;type=entry');
            data.push('');
            data.push(JSON.stringify(requests[i].Value));
        }
        data.push("--changeset_" + changeSetId + "--");
        data.push("--batch_" + batchId);
        load.payload = data.join('\r\n');

        

        return load;
    }
    SdkWebAPI.CreateBatchDeletePayload = function (EntitySetName, guids) {
        //Generate a random set of 10 characters to serve as the batchId value
        var batchId = getRandomId();
        //Generate a random set of 10 characters to serve as the changeSetId value
        var changeSetId = getRandomId();

        var load = { batchId: batchId, payload: null };

        var data = ["--batch_" + batchId]
        data.push("Content-Type: multipart/mixed;boundary=changeset_" + changeSetId);
        data.push("");
        for (var i = 0; i < guids.length; i++) {
            //item in ChangeSet
            data.push("--changeset_" + changeSetId);
            data.push("Content-Type: application/http");
            data.push("Content-Transfer-Encoding:binary");
            data.push("Content-ID: " + (i + 1));
            data.push('');
            data.push('DELETE ' + getWebAPIPath() + EntitySetName + '(' + guids[i].replace('{', '').replace('}', '') + ') HTTP/1.1');
            data.push('Content-Type:application/json;type=entry');
            data.push('');
            data.push('{}');
        }
        data.push("--changeset_" + changeSetId + "--");
        data.push("--batch_" + batchId);
        load.payload = data.join('\r\n');

        return load;
    }
    SdkWebAPI.AddUrlPath = function(part) {
        var uri = getWebAPIPath() + part;
        return uri;
    }

    SdkWebAPI.executeWorkflow = function (entityId, workflowId, successCallback, errorCallback) {
        var query = "workflows(" + workflowId.replace("}", "").replace("{", "") + ")/Microsoft.Dynamics.CRM.ExecuteWorkflow";

        var data = {
            "EntityId": entityId
        };

        var async = !!successCallback;

        // request url
        var req = new XMLHttpRequest();
        req.open("POST", encodeURI(getWebAPIPath() + query), async);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");

        if (async) {
            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    req.onreadystatechange = null;
                    if ((this.status == 200) || (this.status == 240)) {
                        //success callback this returns null since no return value available.
                        if (successCallback)
                            successCallback();
                    } else {
                        if (errorCallback)
                            errorCallback(SdkWebAPI.errorHandler(this), "executeWorkflow");
                    }
                }
            };
        }

        req.send(JSON.stringify(data));

        if (!async) {
            // 200 for Asynch (background) WF and 204 for Synch (real time) wf
            return (((req.status == 200) || (req.status == 204)) ? null : SdkWebAPI.errorHandler(req));
        }
    }
    SdkWebAPI.getWorkflowIdFromName = function (workflowName, entitySchema) {
        var query = "$select=workflowid&$filter=name eq '" + workflowName + "' and primaryentity eq '" + entitySchema + "' and  type eq 1";
        return SdkWebAPI.queryEntitySet('workflows', query, true, null);
    }
    SdkWebAPI.GetOndemandWorkflowsByEntity = function (entitySchema, successCallback, errorCallback) {
        var query = "$select=name,workflowid&$filter=category eq 0 and statuscode eq 2 and ondemand eq true and type eq 1 and primaryentity eq '" + entitySchema + "'";
        SdkWebAPI.queryEntitySet('workflows', query, true, null, successCallback, errorCallback);
    }
    SdkWebAPI.GetWebResourceContentBySchema = function (wbrSchema) {
        var query = "$select=content&$filter=name eq '" + wbrSchema + "'";
        return SdkWebAPI.queryEntitySet('webresourceset', query, true, null);
    }
    SdkWebAPI.GetSolutionInformationByUniquename = function (managedSolutionUniqueName) {
        var query = "$select=version,installedon,friendlyname&$filter=uniquename eq '" + managedSolutionUniqueName + "'";
        return SdkWebAPI.queryEntitySet('solutions', query, true, null);
    }
    SdkWebAPI.PublishAllChanges = function() {
        var req = new XMLHttpRequest();
        req.open("POST", getWebAPIPath() + "PublishAllXml", true);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 204) {
                    //Success - No Return Data - Do Something
                    console.log("Published all changes");
                } else {
                    console.error('Unable to publish all due to errors\r\n' + this.statusText);
                }
            }
        };
        req.send();
    }
    SdkWebAPI.GetDContext = function () {
        return getClientUrl();
    }

    //A helper for generating a unique changelist value for execute batch
    function getRandomId() {
        /// <summary>Generates a random set of 10 characters to use when defining a changelist with SdkWebAPI.executeBatch</summary>
        return getId();
    }
    //Internal supporting functions
    function dateReviver(key, value) {
        var a;
        if (typeof value === 'string') {
            a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
            if (a) {
                return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
            }
        }
        return value;
    }
    function getContext() {
        SDKWEBAPI_GLOBALCONTEXT = null;
        if (typeof window.GetGlobalContext != "undefined") {
            SDKWEBAPI_GLOBALCONTEXT = window.GetGlobalContext();
        }
        else if (typeof GetGlobalContext != "undefined") {
            SDKWEBAPI_GLOBALCONTEXT = GetGlobalContext();
        }
        else {
            if (typeof Xrm != "undefined") {
                if (Xrm.Page != "undefined") {
                    SDKWEBAPI_GLOBALCONTEXT = Xrm.Page.context;
                } else if (Xrm.Utility != "undefined") {
                    SDKWEBAPI_GLOBALCONTEXT = Xrm.Utility.getGlobalContext();
                }
            }
            else if (typeof window.parent.Xrm != "undefined") {
                SDKWEBAPI_GLOBALCONTEXT = window.parent.Xrm.Page.context;
                if (window.parent.Xrm.Page != "undefined") {
                    SDKWEBAPI_GLOBALCONTEXT = window.parent.Xrm.Page.context;
                } else if (window.parent.Xrm.Utility != "undefined") {
                    SDKWEBAPI_GLOBALCONTEXT = window.parent.Xrm.Utility.getGlobalContext();
                }
            }
            else {
                throw new Error("Context is not available.");
            }
        }
    }
    function getClientUrl() {
        if (SDKWEBAPI_GLOBALCONTEXT) {
            return SDKWEBAPI_GLOBALCONTEXT.getClientUrl();
        }
        getContext();
        if (SDKWEBAPI_GLOBALCONTEXT) {
            return SDKWEBAPI_GLOBALCONTEXT.getClientUrl();
        }
    }
    function getWebAPIPath() {
        return getClientUrl() + "/api/data/v" + SDKWEBAPI_VERSION_USERD + "/";
    }
    function getId(idLength) {
        if (isNullOrUndefined(idLength))
            idLength = 10;
        if (isNumber(idLength)) {
            if (idLength > 30) {
                throw new Error("Length must be less than 30.");
            }
        }
        else {
            throw new Error("Length must be a number.");
        }

        var returnValue = "";
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < idLength; i++)
            returnValue += characters.charAt(Math.floor(Math.random() * characters.length));

        return returnValue;
    }
    //build OData query string for specific attribute characteristics 
    function buildQueryString(entityMetadataId, attributMetadataId, attributeType) {
        var result = "EntityDefinitions({0})/Attributes({1})";

        result = result
            .replace("{0}", entityMetadataId)
            .replace("{1}", attributMetadataId);

        if ((attributeType != null) && (attributeType != undefined)) {
            switch (attributeType) {
                case "State":
                    result += "/Microsoft.Dynamics.CRM.StateAttributeMetadata?$expand=OptionSet";
                    break;
                case "Status":
                    result += "/Microsoft.Dynamics.CRM.StatusAttributeMetadata?$expand=OptionSet";
                    break;
                case "Picklist":
                    result += "/Microsoft.Dynamics.CRM.PicklistAttributeMetadata?$expand=OptionSet,GlobalOptionSet";
                    break;
                case "DateTime":
                    //result += "/Microsoft.Dynamics.CRM.DateTimeAttributeMetadata";
                    break;
                case "Double":
                    //result += "/Microsoft.Dynamics.CRM.DoubleAttributeMetadata";
                case "Money":
                    //result += "/Microsoft.Dynamics.CRM.MoneyAttributeMetadata";
                case "Integer":
                    //result += "/Microsoft.Dynamics.CRM.IntegerAttributeMetadata";
                    break;
                case "String":
                    //result += "/Microsoft.Dynamics.CRM.StringAttributeMetadata";
                case "Memo":
                    //result += "/Microsoft.Dynamics.CRM.MemoAttributeMetadata";
                    break;
                case "Boolean":
                    result += "/Microsoft.Dynamics.CRM.BooleanAttributeMetadata?$expand=OptionSet";
                    break;
                default:
                    break;
            }
        }
        return result;
    }
    function parseResponseHeaders(headerStr) {
        var headers = {};
        if (isNull(headerStr) || isUndefined(headerStr)) {
            return headers;
        }
        var headerPairs = headerStr.split('\u000d\u000a');
        for (var i = 0; i < headerPairs.length; i++) {
            var headerPair = headerPairs[i];
            // Can't use split() here because it does the wrong thing
            // if the header value has the string ": " in it.
            var index = headerPair.indexOf('\u003a\u0020');
            if (index > 0) {
                var key = headerPair.substring(0, index);
                var val = headerPair.substring(index + 2);
                headers[key.toLowerCase()] = val;
            }
        }
        return headers;
    }
    //Internal validation functions
    function isFunctionOrNullOrUndefined(obj) {
        if (isNullOrUndefined(obj)) {
            return true;
        }
        if (isFunction(obj)) {
            return true;
        }
        return false;
    }
    function isFunctionOrNull(obj) {
        if (isNull(obj))
        { return true; }
        if (isFunction(obj))
        { return true; }
        return false;
    }
    function isFunction(obj) {
        if (typeof obj === "function") {
            return true;
        }
        return false;
    }
    function isString(obj) {
        if (typeof obj === "string") {
            return true;
        }
        return false;

    }
    function isNumberOrNull(obj) {
        if (isNull(obj))
        { return true; }
        if (isNumber(obj))
        { return true; }
        return false;
    }
    function isNumber(obj) {
        if (typeof obj === "number") {
            return true;
        }
        return false;

    }
    function isNull(obj) {
        if (obj === null)
        { return true; }
        return false;
    }
    function isStringOrNullOrUndefined(obj) {
        if (isStringOrNull(obj))
        { return true; }
        if (isUndefined(obj))
        { return true; }
        return false;
    }
    function isStringOrNull(obj) {
        if (isNull(obj))
        { return true; }
        if (isString(obj))
        { return true; }
        return false;
    }
    function isStringArrayOrNull(obj) {
        if (isNull(obj)) {
            return true;
        }
        return isStringArray(obj)
    }
    function isStringArray(obj) {
        if (isArray(obj)) {
            obj.forEach(function (item) {
                if (!isString(item)) {
                    return false;
                }
            });
            return true;
        }
        return false;
    }
    function isAcceptableCallerId(obj) {
        if (isString(obj))
            return true;
        if (isNullOrUndefined(obj)) {
            obj = false;
            return true;
        }
        return false;
    }
    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
    function isBooleanOrNullOrUndefined(obj) {
        if (isBooleanOrNull(obj)) {
            return true;
        }
        if (isUndefined(obj)) {
            return true;
        }
        return false;
    }
    function isBooleanOrNull(obj) {
        if (isNull(obj))
        { return true; }
        if (isBoolean(obj))
        { return true; }
        return false;
    }
    function isBoolean(obj) {
        if (typeof obj === "boolean") {
            return true;
        }
        return false;
    }
    function isNullOrUndefined(obj) {
        if (isNull(obj) || isUndefined(obj)) {
            return true;
        }
        return false;
    }
    function isUndefined(obj) {
        if (typeof obj === "undefined") {
            return true;
        }
        return false;
    }
    function isNullOrObject(obj) {
        if (isNull(obj)) {
            return true;
        }
        if (Object.prototype.toString.call(this).slice(8, -1) === 'Object') {
            return true;
        }
        return false;
    }
    function isArrayOrNull(obj) {
        if (isNull(obj) || isArray(obj)) {
            return true;
        }
        return false;
    }
    // This function is called when an error callback parses the JSON response
    // It is a public function because the error callback occurs within the onreadystatechange 
    // event handler and an internal function would not be in scope.
    SdkWebAPI.errorHandler = function (resp) {
        switch (resp.status) {
            case 503:
                return new Error(resp.statusText + " Status Code:" + resp.status + " The Web API Preview is not enabled.");
                break;
            default:
                return new Error("Status Code:" + resp.status + " " + parseError(resp));
                break;
        }
    }
    // During the web API preview some errors will have an error property or a Message Property.
    // This function parses the message from either
    function parseError(resp) {
        try {
            var errorObj = JSON.parse(resp.response);
            if (!isNullOrUndefined(errorObj.error)) {
                return errorObj.error.message;
            }
            if (!isNullOrUndefined(errorObj.Message)) {
                return errorObj.Message;
            }
        } catch (e) {

        }
        return "Unexpected Error";
    }
    return SdkWebAPI;
}(SdkWebAPI || {}));
