app.controller('boardCtrl', function($scope, $timeout, $location, $stateParams, $sce, boardSrvc, directorySrvc, $state) {

  firebase.auth().onAuthStateChanged(user => {
        if(!user) {
          console.log('test');
          // $('#user-name').remove()
          // $('#save-modal-button').remove()
          console.log($('#save-modal-button').remove());
        }
        else if (user) {
            this.user = user
            // Append this on sign in
            // $('.username-container').append('<p id="user-name" class="user-item"><span class="username">{{ user.name }}</span><span class="username-hiphen">—</span>Signout</p>')
            return user
            console.log(user);
        };
        // else { ng-show set to false }
        console.log(this.user);
  })

  const boardId = $stateParams.board_id;

  angular.element(document).ready(function(){
    // setTimeout(function(){
    //   $('body').find('.board-view-container').css('opacity', '1')
    // }, 550);
    //
    // function animate(){
    //   TweenMax.staggerFrom(".animate", .25, {opacity:0, scale:1.15}, 0.2);
    // }
    // setTimeout(function(){
    //   animate()
    // }, 300);

    // remove move class GET IT TO WORK
    $scope.removeClass = () => {
      console.log('removed');
      $('body').find('.board-thumbnail-container.selected').removeClass('move')
    }


    // Board name header
    $('body').find('#board-name-header').on('click', function() {
      $(this).prop('contentEditable', true)
      let text = $(this).text()

      $('body').find('#board-name-header').on('blur', function() {
        const name = $(this).text()
        if(name) {
            boardSrvc.updateBoardName(name, boardId);
        }
        else {
          $('#board-name-header').html(text);
        }
      })
    })
    $('body').find('#board-name-header').keypress(function(event){
      if(event.keyCode == 13){
        $(this).prop('contentEditable', false)
        const name = $(this).text()
        if(name) {
          boardSrvc.updateBoardName(name, boardId);
        }
      }

    });

    // Show / Hide - Modal
    $scope.showModal = () => {
      $('#create-board-modal-container').css('display','block');

      setTimeout(function(){
        $('#create-board-modal-container').css('opacity','1');
        $('#create-board-input').focus();
      }, 100);
    }

    $scope.hideModal = () => {
      $('#create-board-modal-container').css('opacity','0');
      setTimeout(function(){
        $('#create-board-modal-container').css('display','none');
        $('#create-board-input').val('')
      }, 300);
    }
  })

  // **** For testing updates
  $scope.images = [];
  const imagesArr = $scope.images;

  // Get Board Name & Board Images / Sites
  boardSrvc.getBoardName(boardId).then(response => {
    $scope.boardName = response.data[0].name;
  })

  boardSrvc.getBoardImages($stateParams).then(response => {
    response.forEach(i => {
      imagesArr.push(i);
    })
    console.log(imagesArr);
  })

  $scope.deleteImage = (image) => {
    let imageProp = 'image_id'
    let imageId = image.image_id;
    let i = imagesArr.length;

    while(i--){
       if( imagesArr[i]
           && imagesArr[i].hasOwnProperty(imageProp)
           && (arguments.length > 2 && imagesArr[i][imageProp] === imageId ) ){

           imagesArr.splice(i,1);

       }
    }
    console.log(imagesArr);
    boardSrvc.deleteImage(imageId, boardId)
  }

  // Add site
  $scope.addSite = (site) => {
    if(!site){
      setTimeout(function(){
        $('#create-board-container').addClass('error')

      }, 50);
      setTimeout(function(){
        alert('Please enter a URL.')
      }, 70);

    }
    if(site) {
      console.log(site);
      console.log(boardId);
      boardSrvc.addSite(site, boardId)
      .then(response => {

        imagesArr.push(response);
        console.log(response);

        $('#create-board-modal-container').css('opacity','0');
        setTimeout(function(){
          $('#create-board-modal-container').css('display','none');
          $('#create-board-input').val('')
          $('#create-board-container').removeClass('error')
        }, 300);
        // $scope.images = response;
      })
    }
  }

  // Remove error class
  $scope.boardNameFocus = () => {
    $('#create-board-container').removeClass('error')
    $('#create-board-input').keypress(function(event){
      $('#create-board-container').removeClass('error')
    });
  }

  /*
    Upload image to Firebase ===================================================
    Add image_url to database
    Update $scope.images
  */

  $scope.upload = (file) => {
    file.id = boardId;
    boardSrvc.upload(file)
    .then(response => {
      $timeout(function(){
        imagesArr.push(response);
        console.log(response);
      }, 0)

      $('#create-board-modal-container').css('opacity','0');
      
      setTimeout(function(){
        $('#create-board-modal-container').css('display','none');
        $('#create-board-input').val('')
      }, 300);
    })
  }

  // Close save modal
  $scope.hideModal = () => {
    $scope.bool = false;
  }

  // Invoke directorySrvc.getUser to set userId and userName on $rootScope
  // on topBarCtrl
  directorySrvc.getUser($stateParams)
});
