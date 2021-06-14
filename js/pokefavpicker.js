$( document ).ready(function() {

	var filename = ""
	var appendString = "";
	var typeString = "";
	var typeFilename = "";
    var typeTextHTML = "";
    var typeText = "";
	var idCurrentSquare = "";
	var iconString = "";
    var tagText = "";
	var iconFilename = "";
	var nextGenSpacer;
    var viableOnly = true;
    var gridStateObj = [];
    var gridStateString = "";

    var pickerModal = document.getElementById('pickerModal');

    var columnList = ["normal",
                      "fire",
                      "grass",
                      "water",
                      "electric",
                      "ice",
                      "fighting",
                      "poison",
                      "ground",
                      "flying",
                      "psychic",
                      "bug",
                      "rock",
                      "ghost",
                      "dragon",
                      "dark",
                      "steel",
                      "fairy",
                      "starter",
                      "mega",
                      "legend",
                      "favorite"];

    var generationCutoffs = [1,152,252,387,494,650,722,810,899];                  


	for (var i in pokedex){
		appendString = '';
		typeImgTag = '';
		iconImgTag = '';
        typeText = ';';
        pokedex[i].id = i;
        pokedex[i].generations = '';

        for (var g in generationCutoffs){
            if (pokedex[i].dexNumber < generationCutoffs[g]){
                pokedex[i].generations += g.toString() + ";";
                break;
            }
        };
        if (pokedex[i].gen != null)
            pokedex[i].generations += pokedex[i].gen.toString() + ";";

		for (var t in pokedex[i].type){
			typeFilename = pokedex[i].type[t].toLowerCase() + ".gif";
			typeImgTag += '<img src="./img/type/' + typeFilename + '" />';
            typeText += pokedex[i].type[t] + ";";
        };

        typeTextHTML = "<span style='display: none;'>" + typeText + "</span>";
        tagText = typeText;

        if(pokedex[i].starter == true){
            tagText += "starter;"
        }

        if(pokedex[i].transform == true){
            tagText += "mega;"
        }

        if(pokedex[i].legend == true){
            tagText += "legend;"
        }


		filename = "";
		if (pokedex[i].filename != null)
			filename = pokedex[i].filename + ".png";
		else
			filename = String(pokedex[i].dexNumber).padStart(3, '0') + ".png";

        pokedex[i].realfilename = filename;

		iconFilename = "";
		if (pokedex[i].icon != null)
			iconFilename = pokedex[i].icon + ".png";
		else
			iconFilename = String(pokedex[i].dexNumber).padStart(3, '0') + ".png";

		iconImgTag = "<img src='./img/icons/" + iconFilename + "' />";

        var spacerLeft = '<tr class="trGenSpacer"><td class="tdGenHeader" colspan="4"><div><hr style="float: left; width: 40%"/>';
        var spacerRight = '<hr style="float: right; width: 40%"/></div></td></tr>';

        if (pokedex[i].dexNumber == 1)
            appendString += spacerLeft + 'Gen I' + spacerRight; 
        else if (pokedex[i].dexNumber == 152)
            appendString += spacerLeft + 'Gen II' + spacerRight; 
        else if (pokedex[i].dexNumber == 252)
            appendString += spacerLeft + 'Gen III' + spacerRight; 
        else if (pokedex[i].dexNumber == 387)
            appendString += spacerLeft + 'Gen IV' + spacerRight; 
        else if (pokedex[i].dexNumber == 494)
            appendString += spacerLeft + 'Gen V' + spacerRight; 
        else if (pokedex[i].dexNumber == 650)
            appendString += spacerLeft + 'Gen VI' + spacerRight; 
        else if (pokedex[i].dexNumber == 722)
            appendString += spacerLeft + 'Gen VII' + spacerRight; 
        else if (pokedex[i].dexNumber == 810)
            appendString += spacerLeft + 'Gen VIII' + spacerRight; 

		appendString += '<tr class="trPkmnList"'; 
		appendString += 	'data-pkmn-name="' + pokedex[i].name + '" ';
        appendString +=     'data-pkmn-id="' + pokedex[i].id + '" ';
		appendString += 	'data-pkmn-dex="' + pokedex[i].dexNumber + '" ';
		appendString += 	'data-pkmn-filename="' + filename + '" ';
        appendString +=     'data-pkmn-gens="' + pokedex[i].generations + '" ';
        appendString +=     'data-pkmn-col-tags="' + tagText + '" ';
		appendString +=		'>';
		appendString += 	'<td>';
		appendString += 		'<i>' + String(pokedex[i].dexNumber).padStart(3,'0') + '</i>';
		appendString += 	'</td>';	
		appendString +=		'<td>';
		appendString +=         iconImgTag;
		appendString +=		'</td>';
		appendString +=		'<td style="text-align: left;">';
		appendString += 		pokedex[i].name ;
		appendString += 	'</td>';
		appendString += 	'<td style="text-align: left;">';
		appendString +=			typeImgTag + typeTextHTML;
		appendString += 	'</td>';
		appendString += '</tr>';

		$( '#tbPkmnList' ).append(appendString); 
	};

    $('.pickable').each(function(i, obj) {
        $( obj ).attr("id", i);
        $( obj ).attr("data-selected-id", -1);
        $( obj ).attr("data-bs-toggle", "modal");
        $( obj ).attr("data-bs-target", "#pickerModal"); 

        $( obj ).attr("data-row", parseInt(i / 22) + 1);
        $( obj ).attr("data-column", parseInt(i % 22));

        $( obj ).addClass(columnList[parseInt(i % 22)]);
    });

    var params = new URLSearchParams(window.location.search);
    if (params.has('q')){
        gridStateObj = arrayFromString(params.get('q'));
        loadStateFromArray();
    };

    //Functions
    function arrayFromString(instring){
        var decoded = instring; 
        var outarray = [];
        var entries = decoded.split(',');
        var parsed = 0;
        for( var i in entries){
            parsed = parseInt(entries[i]);
            if (isNaN(parsed)) outarray[i] = -1;
            else outarray[i] = parsed;
        }
        return outarray;
    };
    
    function arrayToString(){
        var outstring = '';
        for (var i in gridStateObj){
            if (gridStateObj[i] != -1)
                outstring += gridStateObj[i];
            if( i < gridStateObj.length - 1)
                outstring += ',';
        }  
        return outstring;
    };

    function updateGridStateObj(){
        $('.pickable').each(function(i, obj) {
            gridStateObj[parseInt($( obj ).attr("id"))] = parseInt($( obj ).attr("data-selected-id"));
        });
        window.history.replaceState(null, null, '?q=' + arrayToString()); 
    };

    function loadStateFromArray(){
        var newHTML;
        for(var i in gridStateObj){
            if (gridStateObj[i] != -1 && pokedex[gridStateObj[i]] != null) {
                newHTML = "<img src='./img/sprites/" + pokedex[gridStateObj[i]].realfilename + "' title='" +  pokedex[gridStateObj[i]].name  + "' />";
            }
            else newHTML = "";

            $('#' + i).attr("data-selected-id", gridStateObj[i]);
            $('#' + i).html(newHTML);
        }
    }

    //Event Listeners

    $( "#cbViable[type=checkbox]" ).change(function(){
        viableOnly = this.checked;
        $("#inputSearch").trigger('keyup');
    });

	pickerModal.addEventListener('show.bs.modal', function (event) {
        idCurrentSquare = $( event.relatedTarget ).attr("id");
		$("#inputSearch").val('');
		$( ".trGenSpacer" ).each(function() {$(this).show();});
	});

    
	pickerModal.addEventListener('shown.bs.modal', function (event) {
		//$("#inputSearch").focus();
        $("#inputSearch").trigger('keyup');
	});

	$('.trPkmnList').click(function() {
		var newHTML = "<img src='./img/sprites/" + $( this ).attr('data-pkmn-filename') + "' title='" +  $( this ).attr('data-pkmn-name')  + "' />";
		$( "#" + idCurrentSquare ).html(newHTML);
        $( "#" + idCurrentSquare ).attr("data-selected-id", $( this ).attr('data-pkmn-id'));
		var modalInstance = bootstrap.Modal.getInstance(pickerModal);
		modalInstance.hide();
        updateGridStateObj();
	});

    var curGenIndex;
    var curTypeIndex;
    var searchValue;
    
	$("#inputSearch").on("keyup", function() {

        curTypeIndex = $( "#" + idCurrentSquare ).attr("data-column");
        curGenIndex = $( "#" + idCurrentSquare ).attr("data-row");

    	searchValue = $(this).val().toLowerCase();
    	
        $( ".trGenSpacer" ).each(function() {$(this).show();});

        if (viableOnly){
            if (curGenIndex != "9" && curTypeIndex != "21"){
               $("#tbPkmnList .trPkmnList").filter(function() {
                    $(this).toggle(
                        ($(this).text().toLowerCase().indexOf(searchValue) > -1)
                        && ( $(this).attr("data-pkmn-col-tags").toLowerCase().indexOf(columnList[curTypeIndex]) > -1)
                        && ( $(this).attr("data-pkmn-gens").toLowerCase().indexOf(curGenIndex) > -1)
                    );
                }); 
            }
            else if (curGenIndex !="9" && curTypeIndex == "21" ){
                $("#tbPkmnList .trPkmnList").filter(function() {
                    $(this).toggle(
                        ($(this).text().toLowerCase().indexOf(searchValue) > -1)
                        && ( $(this).attr("data-pkmn-gens").toLowerCase().indexOf(curGenIndex) > -1)
                    );
                });
            }
            else if (curGenIndex =="9" && curTypeIndex != "21" ){
                $("#tbPkmnList .trPkmnList").filter(function() {
                    $(this).toggle(
                        ($(this).text().toLowerCase().indexOf(searchValue) > -1)
                        && ( $(this).attr("data-pkmn-col-tags").toLowerCase().indexOf(columnList[curTypeIndex]) > -1)
                    );
                });
            }
            else {
                $("#tbPkmnList .trPkmnList").filter(function() {
                    $(this).toggle($(this).text().toLowerCase().indexOf(searchValue) > -1);
                });
            };

            $( ".trGenSpacer" ).each(function(i) {
                nextGenSpacer = $(this).nextAll("tr:visible").first();
                if(nextGenSpacer.hasClass('trPkmnList'))
                    $(this).show();
                else
                    $(this).hide(); 
            });
        }
        else if (!viableOnly){
            $("#tbPkmnList .trPkmnList").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(searchValue) > -1);
            });
        };

        $("#tbPkmnList .trPkmnList:visible").odd().removeClass("dark");
        $("#tbPkmnList .trPkmnList:visible").even().addClass("dark");
    });
});