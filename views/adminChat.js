let adminChatTpl =   '<div class="container-fluid">'+
                        '<button class="arrow"><span class="glyphicon glyphicon-arrow-left"></span></button>'+
                        '<header class="row">'+
                            '<div id="log-text">Logout</div>'+
                                '<h1>blA blA chAt</h1>'+
                            '<div id="logout"><span id="nickname"></span></div>'+
                        '</header>'+
                        '<div class="row">'+
                            '<div id="online-users" class="col-sm-4"></div>'+
                            '<div class="wrapper-form col-sm-8">'+
                                '<div class="user-column" id="subscribe"></div>'+
                                '<div class="text-field">'+
                                    '<form id="form-chat" name="publish">'+
                                    '<div class="">'+
                                        '<div class="input-group input-group-lg">'+
                                            '<input class="form-control" type="text" name="message" placeholder="type your message" maxlength="200">'+
                                            '<span class="input-group-btn counter-wrapper">'+
                                                '<input class="btn btn-secondary btn-success counter" type="button" value="0/200" disabled style="cursor: none">'+
                                            '</span>'+
                                            '<span class="input-group-btn">'+
                                                '<input class="btn btn-secondary btn-success" type="submit" value="Go">'+
                                            '</span>'+
                                        '</div>'+
                                    '</div>'+
                                    '</form>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                        '</div>'+
                        '<script src="chat/admin.js" defer></script>';
module.exports = adminChatTpl;