$(document).ready(function(){
    $(".rune").each(function(index, element) {
        const slotNumber = $(element).find('.slot').find("img").attr('alt');
        const set = $(element).find(".set");
        set.css({left: "5%", top:"1%"});
        if(slotNumber==1){
            set.css({top:"4%"})
        }
        if(slotNumber==4){
            set.css({top:"2%"})
        }
        
    });
});
