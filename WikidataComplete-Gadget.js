/********************************************************************************************************
* Google Summer of Code 2021 Project for Wikimedia Foundation                                           *
* Project Name : WikidataComplete                                                                       *
* Project Documentation : https://www.wikidata.org/wiki/Wikidata:WikidataComplete                       *
* Mentors: Dennis Diefenbach,Andreas Both, Aleksandr Perevalov,Kunpeng Guo                              *
* Participant: Dhairya Khanna                                                                           *                                                           
* Re-Written for Gratisdata by Chima Ugo								*
********************************************************************************************************/
importScript('User:Ugochimobi/celebration.js');
(function(mw, $, wb) {
    "use strict";

    if (mw.config.get('wgNamespaceNumber') !== 0 || !mw.config.exists('wbEntityId')) {
        return;
    }

    var lang = mw.config.get('wgUserLanguage');
    var messages, entityid = mw.config.get('wbEntityId'), api = new mw.Api();
    var username = mw.config.get('wgUserName');
    messages = (function () {
        var translations = {
            de: {
                'title': 'Anweisungen aktualisieren',
                'more': 'mehr',
                'inverse': 'invers',
                'show-inverse': 'geholte Anweisungen anzeigen',
                'no-result': 'kein Ergebnis',
                'loading': 'laden...'
            },
            en: {
                'title1': 'You have these number of statements to approve',
                'title2': 'Show next entity which can be  approved',
                'more': 'more',
                'inverse': 'inverse',
                'show-inverse': 'show fetched statements',
                'no-result': 'no result',
                'loading': 'loading...'
            },
            fr: {
                'title': 'Mettre à jour les relevés',
                'more': 'plus',
                'inverse': 'inverse',
                'show-inverse': 'afficher les déclarations récupérées',
                'no-result': 'pas de résultats',
                'loading': 'chargement...'
           },
           'zh-hans': {
                'title': '更新声明',
                'more': '更多',
                'inverse': '反向',
                'show-inverse': '显示获取的语句',
                'no-result': '无结果',
                'loading': '加载中...'
            },
            es:{
                'title': 'Actualizar declaraciones',
                'more': 'más',
                'inverse': 'inverso',
                'show-inverse': 'mostrar declaraciones recuperadas',
                'no-result': 'sin resultados',
                'loading': 'cargando...'

            },           
        },
        chain = mw.language.getFallbackLanguageChain(),
        len = chain.length,
        ret = {},
        i = len - 1;
        while (i >= 0) {
            if (translations.hasOwnProperty(chain[i])) {
                $.extend(ret, translations[chain[i]]);
            }
            i = i - 1;
        }
        return ret;
    }());
    //The length of the facts generated from the dataset.
    var facts_length  = {};
    var newfacts;
    $.ajax({
        url: 'https://qanswer-svc3.univ-st-etienne.fr/facts/get?qid=' + entityid + '&format=json',
        async: false,
        dataType: 'json',
        success: function (data) {
        facts_length  = data.length;
        newfacts = data;
        }
    });

    var propertyList2 = []
        $(".wikibase-statementgroupview-property-label a").each(function (){
            propertyList2.push($(this).prop("href").split("/wiki/Property:")[1].toString())
        });
        
        // the list to display
        var filteredFacts = newfacts.filter(newfact => !propertyList2.includes(newfact.property))
        var filteredFactslen = filteredFacts["length"];
        
        

    var highlightlink = [];
    var boldtext = [];
    $.ajax({
        url: 'https://qanswer-svc3.univ-st-etienne.fr/facts/get?qid=' + entityid + '&format=json',
        async: false,
        dataType: 'json',
        success: function (data) {
            
            for(var i=0; i<data.length; i++) {
        var url = data[i].gratispaideiaLink;
        var ans = data[i].text;
       // <a target="_blank" rel="noreferrer" href={`${url}#:~:text=${encodeURIComponent(evidence.slice(0, offset_start))}-,${answer.answer}`}> => For chrome highlight, make the code fit your needs.
        var evidence = data[i].evidence;
        var startindex = data[i].startIdx;
        var endindex = data[i].endIdx;
        var res = encodeURIComponent(evidence.slice(0, startindex));
        
        
    
    highlightlink[i] = url + '#:~:text='+res + '-,' + ans;

    boldtext[i] = evidence.substring(0, startindex) +'<b>'+ evidence.substring(startindex,endindex) +'</b>' + evidence.substring(endindex);
    
}
        }
    });
    
   //Generating a new random item to approve
	var newitem = {};
    $.ajax({
        url: "https://qanswer-svc3.univ-st-etienne.fr/fact/get?id=EMPTY&category=EMPTY&property=EMPTY",
        async: false,
        dataType: 'json',
        success: function(data) {
            newitem = data.gratisdataLink;
        }
    });
    
    function start_menu_null(filteredFactslen ){
        var newitemtoappend;
        if(filteredFactslen  == 0)newitemtoappend='';
        else newitemtoappend = "Next Approvable Item";
    return newitemtoappend;
    }
    var newitemtoappend = start_menu_null(filteredFactslen );
     //Function for generating message for the available facts 
    var flag = 0;
     function start_menu(filteredFactslen ){
        var final_message = '';
        if(filteredFactslen ==1){
            final_message = ('There is '+ String(filteredFactslen )+ ' statement to approve.');
        }    
        else if(filteredFactslen >1){
                final_message = ('There are '+ String(filteredFactslen )+ ' statements to approve.');
        }
        
        else if(filteredFactslen ==0){
            flag = 1;
             final_message = ("Go to entity with statements to approve".link(newitem));
         }
        return final_message;
        }
       
    var html = '\
        <div class="wb-section-heading section-heading wikibase-statements wikibase-statements">\
        <div class="gratisdatacomplete">\
        <div class="wikibase-statementgrouplistview" id="inversesection" > \
             <div class="wikibase-listview"></div> \
             <div class="wikibase-showinverse" style="padding:10px;overflow:hidden;border: 3px solid #c8ccd1;margin: 20px 0;text-align: center;">\
             <div class="wikibase-showinverse-parent" style="float:left;padding-left: 308px;">\
             <div class="wikibase-showinverse-child-1" style="float: left;padding-left: 13px;">\</div>\
           <div class="wikibase-showinverse-parent" style= "float: right;padding-right: 20px;">\
           <div class="wikibase-showinverse-child-2" style="position: absolute;float: right;padding-left: 207px;">  \
             <a href="'+ newitem +'" title="Find a new item">'+newitemtoappend+'</a>\
             </div>\
           </div>\
             </div> \
        </div>\
        </div>\
        </div>';
        /*
        The following function is used to create claim using Gratisdata APIs. 
        Want know about them? Check out the documentation: https://gratisdata.miraheze.org/w/api.php 
        */
        $(document).ready(function() {
             $('#inversesection:last').remove();
        });
        function createclaim(qid,pid,snak,sourceSnaks,snaksorder,username,acc){
            var api = new mw.Api();
            api.get( { action: 'query', meta: 'tokens'}).then(
                function(aw) {
                    var token = aw.query.tokens.csrftoken;
                 return  api.post( { 
                        action: 'wbcreateclaim',    //Calling API to craete the claim
                        entity: qid,
                        property: pid,
                        snaktype: 'value',
                        value: snak,
                        summary : "Edited with Gratisdatacomplete",
                        token: token
                        }).then(function (data) {
                            var comment = `Statement Suggested by Gratisdatacomplete and approved by the user: ${username}`;
                            var api = new mw.Api();
                            var token = mw.user.tokens.values.csrfToken;
                            return  api.post({

                                action: 'wbsetreference',   //Calling API to craete the reference
                                statement: data.claim.id,
                                snaks: JSON.stringify(sourceSnaks),
                                snaksorder: JSON.stringify(snaksorder),
                                token: token,
                                summary: comment
                                })
                            }

                        ).then(
                               function(data2){
                                       if(data2.success == 1)
                                        { console.log("Claim Added Successfully");
                                        var acceptance = {
                                            "url": "https://qanswer-svc3.univ-st-etienne.fr/fact/correct?userCookie=c51f3c6f-ef1c-41ff-b1ca-7a994666b93e&factId="+acc+"&correction=1",
                                            "method": "POST",
                                            "timeout": 0,
                                          };
                                          
                                          $.ajax(acceptance).done(function (response) {
                                            console.log(response);
                                            location.reload();
                                          });
                                         location.reload();
                               }
                               });       
                        });
                    }
                    let nowdate = new Date();
                    nowdate.setUTCHours(0,0,0,0);
                    const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
                    

    /*
    The main function for loading the data to the gadget.
    */
   //https://en.wikipedia.org/wiki/Batgirl_and_the_Birds_of_Prey#:~:text=Batgirl%20and%20the%20Birds%20of%20Prey%20was%20a%20monthly%20ongoing%20American-,comic%20book
   var check = new Map();
   var newList = [];
   function Properties(){
        $(document).ready(function(){
            var propertyList = []
        $(".wikibase-statementgroupview-property-label a").each(function (){
            propertyList.push($(this).prop("href").split("/wiki/Property:")[1].toString())
        });
        
            // this gives you the list of existing property ids
            for(var i = 0;i<propertyList.length;i++){
            newList[i] = propertyList[i];
            }
            // check the property id proposed by Gratisdatacomplte api and you can control the show-no-show case.
        })
    }
    Properties();
    
    
   function loaditems() {
        var fetchurl = 'https://qanswer-svc3.univ-st-etienne.fr/facts/get?qid=' + entityid + '&format=json';
        $.getJSON(fetchurl,
        function( result1 ){
        for (var i=0; i< result1.length; i++){ 
            
            
            if(!newList.includes(String(result1[i].property))){
                    var statementgroup = '\
	                        <div id= "'+result1[i].id+ '" class="wikibase-statementgroupview listview-item" style = "border:3px solid #0645ad !important;margin:20px 0;"> \
	                            <div class="wikibase-statementgroupview-property" style="border: revert;"> \
	                                <div class="wikibase-statementgroupview-property-label" dir="auto"> \
                                    <a href="https://gratisdata.miraheze.org/wiki/Property:' + result1[i].property + '">' + result1[i].question + '</a>\
	                                </div> \
	                            </div> \
	                            <div class="wikibase-statementlistview" style="border:revert;"> \
	                                <div class="wikibase-statementlistview-listview"> \
	                                </div> \
	                            </div> \
                 <div class="wikibase-statementview wb-normal listview-item wikibase-toolbar-item"> \
					<div class="wikibase-statementview-rankselector"><div class="wikibase-rankselector ui-state-disabled"> \
                    <span class="ui-icon ui-icon-rankselector wikibase-rankselector-normal" title="Normal rank"></span> \
					</div></div>  \
                    <div class="wikibase-statementview-mainsnak-container"> \
                        <div class="wikibase-statementview-mainsnak" dir="auto"> \
                            <div class="wikibase-snakview"> \
                                <div class="wikibase-snakview-property-container"> \
                                    <div class="wikibase-snakview-property" dir="auto"> \
                                    </div> \
                                </div> \
                                <div class="wikibase-snakview-value-container" dir="auto"> \
                                    <div class="wikibase-snakview-value wikibase-snakview-variation-valuesnak"> \
                                        <a href="' + result1[i].object[0].object + '" >' + result1[i].object[0].objectLabel + '</a>\
                                    </div> \
                                    </div>\
                                </div> \
                            </div> \
                        </div> \
                    </div> \
                    <span class="wikibase-toolbar-container wikibase-edittoolbar-container">\
                    <span class="wikibase-toolbar-item wikibase-toolbar wikibase-toolbar-container"><span class="wikibase-toolbar-item wikibase-toolbar wikibase-toolbar-container"><span class="wikibase-toolbarbutton wikibase-toolbar-item wikibase-toolbar-button wikibase-toolbar-button-save"><a class = "f2w-button f2w-property f2w-approve" href="'+'#'+ result1[i].property +'" title="" text-id = "' + result1[i].text + '" data-id = "'+ result1[i].property +'" url-id = "' + result1[i].object[0].object + '" " qualifier-id = "' + result1[i].evidence + '" " ref-id = "' + result1[i].gratispaideiaLink + '"accept-id = "'+ result1[i].id +'"style="padding-right: 30px;" ><span class="wb-icon" style = "display:inline-block;vertical-align:middle;background-position:center"></span>publish</a></span></span></span>\
                    <span class="wikibase-toolbar-item wikibase-toolbar wikibase-toolbar-container"><span class="wikibase-toolbar-item wikibase-toolbar wikibase-toolbar-container"><span class="wikibase-toolbarbutton wikibase-toolbar-item wikibase-toolbar-button wikibase-toolbar-button-cancel"><a class="f2w-button f2w-property f2w-reject" href = "#" title="" reject-id = "'+ result1[i].id +'"style="padding-right: 20px;"><span class="wb-icon" style="padding-top: 22px;"></span>reject</a></span></span></span>\
                    </span> \
                    <div class = wikibase-statementview-references-container>\
                        <div class = wikibase-statementview-references-heading>\
                            <a class="ui-toggler ui-toggler-toggle ui-state-default">\
                            <span class="ui-toggler-icon ui-icon ui-icon-triangle-1-s ui-toggler-icon3dtrans"></span>\
                            <span class="ui-toggler-label">1 reference</span>\
                            </a>\
                            <div class="wb-tr-app"><!----></div>\
                            </div>\
                            <div class="wikibase-statementview-references wikibase-initially-collapsed" style="display: block;"><div class="wikibase-listview2"><div class="wikibase-referenceview wikibase-referenceview-d5847b9b6032aa8b13dae3c2dfd9ed5d114d21b3">\
<div class="wikibase-referenceview-heading"></div>\
<div class="wikibase-referenceview-listview"><div class="wikibase-snaklistview">\
<div class="wikibase-snaklistview-listview"><div class="wikibase-snakview wikibase-snakview-5a343e7e758a4282a01316d3e959b6e653b767fc">\
<div class="wikibase-snakview-property-container">\
<div class="wikibase-snakview-property" dir="auto"><a title="Property:P394" href="/wiki/Property:P394">Gratispaideia import URL</a></div>\
</div>\
<div class="wikibase-snakview-value-container" dir="auto">\
<div class="wikibase-snakview-typeselector"></div>\
<div class="wikibase-snakview-body">\
<div class="wikibase-snakview-value wikibase-snakview-variation-valuesnak"><a title="' + entityid + '" href="' + highlightlink[i] + '"target = "_blank" rel="noreferrer">' + result1[i].gratispaideiaLink + '</a></div>\
<div class="wikibase-snakview-indicators"></div>\
</div>\
</div>\
</div></div>\
</div></div>\
</div></div>\
<div class="wikibase-referenceview wikibase-referenceview-b4744396545cd28b2367fad16c02c0b839379bc5">\
<div class="wikibase-referenceview-heading"></div>\
<div class="wikibase-referenceview-listview"><div class="wikibase-snaklistview">\
<div class="wikibase-snaklistview-listview"><div class="wikibase-snakview wikibase-snakview-7e00f9de0f47d0de70ec6ee58edfc93608905b2d">\
<div class="wikibase-snakview-property-container">\
<div class="wikibase-snakview-property" dir="auto"><a title="Property:P200" href="/wiki/Property:P200">retrieved</a></div>\
</div>\
<div class="wikibase-snakview-value-container" dir="auto">\
<div class="wikibase-snakview-typeselector"></div>\
<div class="wikibase-snakview-body">\
<div class="wikibase-snakview-value wikibase-snakview-variation-valuesnak">' + nowdate.getDate() + ' ' + monthNames[nowdate.getMonth()] + ' ' + nowdate.getUTCFullYear() + '</div>\
<div class="wikibase-snakview-indicators"></div>\
</div>\
</div>\
</div></div>\
</div></div>\
</div>\
<div class="wikibase-referenceview wikibase-referenceview-d4bd87b862b12d99d26e86472d44f26858dee639">\
<div class="wikibase-referenceview-heading"></div>\
<div class="wikibase-referenceview-listview"><div class="wikibase-snaklistview">\
<div class="wikibase-snaklistview-listview"><div class="wikibase-snakview wikibase-snakview-f30cbd35620c4ea6d0633aaf0210a8916130469b">\
<div class="wikibase-snakview-property-container">\
<div class="wikibase-snakview-property" dir="auto"><a title="Property:P193" href="/wiki/Property:P193">evidence</a></div>\
</div>\
<div class="wikibase-snakview-value-container" dir="auto">\
<div class="wikibase-snakview-typeselector"></div>\
<div class="wikibase-snakview-body">\
<div class="wikibase-snakview-value wikibase-snakview-variation-valuesnak">'+boldtext[i]+'</div>\
<div class="wikibase-snakview-indicators"></div>\
</div>\
</div>\
</div></div>\
</div></div>\
</div>\
</div>\
                        </div>\
                    </div>\
                    </div>';
                    //To append the statements to the HTML code.
                    $('#inversesection').find('.wikibase-listview').parent().append(statementgroup);    
                $('.f2w-approve').unbind('click').on('click',function(e){
                    //e.preventDefault();
                    e.stopPropagation();
                    //celebrate();
                    let arg1 = e.target.getAttribute('data-id');    
                    let arg2 = e.target.getAttribute('text-id');    
                    let arg3 = e.target.getAttribute('url-id');
                    let arg4 = e.target.getAttribute('qualifier-id');
                    let arg5 = e.target.getAttribute('ref-id');
                    let today = new Date();
                    today.setUTCHours(0, 0, 0, 0);
                    var snak = JSON.stringify({ "entity-type": 'item', "numeric-id": arg3.substring(32) });
                    var snaksorder = ["P394","P170"];
                    var sourceSnaks = {
                        "P394": [
                            {
                                "snaktype": "value",
                                "property": "P394",
                                "datavalue": {
                                    "value": arg5,
                                    "type": "string"
                                },
                                "datatype": "url"
                            }
                        ],
                        "P200": [
                            {
                                "snaktype": "value",
                                "property": "P200",
                                "datavalue": {
                                    "value": {
                                        "time": "+" + today.toISOString().replace(/\.\d*Z$/, 'Z'),
                                        "timezone": 0,
                                        "before": 0,
                                        "after": 0,
                                        "precision": 11,
                                        "calendarmodel": "http://gratisdata.miraheze.org/entity/Q471"
                                    },
                                    "type": "time"
                                },
                                "datatype": "time"
                            }
                        ],
                        "P170": [
                            {
                                "snaktype": "value",
                                "property": "P170",
                                "datavalue": {
                                    "value": {
                                        "text": arg4,
                                        "language": "en"
                                    },
                                    "type": "monolingualtext"
                                },
                                "datatype": "monolingualtext"
                            }
                        ]
                    };
                    let acc = e.target.getAttribute('accept-id');
                    createclaim(entityid, arg1,snak,sourceSnaks,snaksorder,username,acc);
                    
                    
                    
                    mw.notify ('You have successfully added the claim',
					{
						title: 'GratisdataComplete-info',
						autoHide: true,
						type: 'info'
                        
					}.then(celebrate())
				);
                
                    
                })
                $('.f2w-reject').unbind('click').on('click',function(e){
                    e.preventDefault();
                    var answer_after_reject;
                    if((filteredFactslen-1)==1){
                        answer_after_reject = `There is ${filteredFactslen-1} statement to approve`;   
                    document.querySelector("#inversesection > div.wikibase-showinverse > div > div.wikibase-showinverse-child-1 > a").innerHTML = answer_after_reject;
                    }
                    if((filteredFactslen-1)>1){
                        answer_after_reject = `There are ${filteredFactslen-1} statements to approve`;   
                     document.querySelector("#inversesection > div.wikibase-showinverse > div > div.wikibase-showinverse-child-1 > a").innerHTML = answer_after_reject;
                    }
                    else{
                        document.querySelector("#inversesection > div.wikibase-showinverse > div > div.wikibase-showinverse-parent > div > a").innerHTML = '';
                    document.querySelector("#inversesection > div.wikibase-showinverse > div > div.wikibase-showinverse-child-1 > a").innerHTML = "Go to entity with statements to approve".link(newitem);
                    }
                    mw.notify ('You have successfully rejected the claim',
					{
						title: 'GratisdataComplete-info',
						autoHide: true,
						type: 'info'
					}
                    
				);

                let rej = e.target.getAttribute('reject-id');
                var rej_string = String(rej);
                var new_rej_string = '#\\3' + rej_string.substring(0,1) + ' ' + rej_string.substring(1);
                document.querySelector(new_rej_string).remove();
                //POST request for removing the rejected claim.
                var rejections = {
                    "url": "https://qanswer-svc3.univ-st-etienne.fr/fact/correct?userCookie=c51f3c6f-ef1c-41ff-b1ca-7a994666b93e&factId="+rej+"&correction=2",
                    "method": "POST",
                    "timeout": 0,
                  };
                  
                  $.ajax(rejections).done(function (response) {
                    console.log(response);
                    //location.reload();
                  });
                });
                

               
            }}
        });
    
    }
       
    function init() {
        $('div.wikibase-statementgrouplistview').first().prepend(html);
        $('#inversesection').find('.wikibase-showinverse-child-1').append(
            $( '<a>' )
            .attr( 'href', '#' )
            .html(start_menu(filteredFactslen ))
            .click( function ( event ) {
                if(flag == 0){
                    event.preventDefault();
                $('#inversesection > div.wikibase-showinverse').css({'border': '3px solid #0645ad'})
                }
                loaditems();
                $(this).off(event);
            })
        );
        setTimeout(function(){
            if($("#inversesection > div.wikibase-addtoolbar.wikibase-toolbar-item.wikibase-toolbar.wikibase-addtoolbar-container.wikibase-toolbar-container")=== null) //To remove auto-generated add statements button
            {
                console.log("Not Found");
            }
            else{
    
                $("#inversesection > div.wikibase-addtoolbar.wikibase-toolbar-item.wikibase-toolbar.wikibase-addtoolbar-container.wikibase-toolbar-container").remove();
    
            }    },1000);
         
    }

    $(init);

}(mediaWiki, jQuery, wikibase));
