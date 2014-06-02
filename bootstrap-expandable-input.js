(function ($) {
  'use strict';

  // EXPANDABLE INPUT CLASS DEFINITION
  // =================================

  //
  //
  //
  var ExpandableInput = function (el) {
    var $input;
    var valueOnFocus;

    // 1. cache elements for performance reasons and
    // 2. setup event bindings
    function initialize () {
      $input = $(el);
      setName();
      initStyling();

      $input.on('input', handleInput);
      $input.on('focus', handleFocus);
      $input.on('blur', handleBlur);
      $input.on('keyup', handleKeyUp);
    }

    // Event handlers
    // --------------

    //
    function handleInput ( /*event*/ ) {
      cleanupIfEmpty();
    }

    //
    function handleFocus ( /*event*/ ) {
      valueOnFocus = $input.text();
    }

    //
    function handleBlur ( /*event*/ ) {
      var valueOnBlur = $input.text();
      if (valueOnBlur !== valueOnFocus) {
        $input.trigger('change');
      }
    }

    //
    function handleKeyUp ( event ) {
      var enteredViaTabKey = event.which === 9;
      if (enteredViaTabKey) {// TAB
        $input.select();
      }
    }


    // Internal Methods
    // ----------------

    //
    //
    //
    function setName () {
      var name = $input.attr('name');
      if (name) $input[0].name = name;
    }

    //
    // adds `contenteditable-inline` or `contenteditable-block`,
    // depending of the styling of the input. This is needed to
    // prevent line breaks in inline elements, among other things.
    //
    function initStyling () {
      var display = $input.css('display');

      if (display === 'inline' || display === 'inline-block') {
        $input.addClass('contenteditable-inline');
      } else {
        $input.addClass('contenteditable-block');
      }


      // set min width to current width unless already set
      $input.css({
        'min-width': ''+$input.outerWidth()+'px'
      });
    }


    //
    //
    //
    function cleanupIfEmpty() {
      var content = $input.html();
      if (content === '<br>' || content === '<div><br></div>') {
        $input.html( '' );
      }
    }

    initialize();
  };

  // EXPANDABLE INPUT PLUGIN DEFINITION
  // ==================================

  $.fn.expandableInput = function (option) {
    return this.each(function () {
      var $this = $(this);
      var api  = $this.data('bs.expandableInput');

      if (!api) {
        $this.data('bs.expandableInput', (api = new ExpandableInput(this)));
      }
      if (typeof option === 'string') {
        api[option].call($this);
      }
    });
  };

  $.fn.expandableInput.Constructor = ExpandableInput;


  // JQUERY PATCHES
  // ==============

  //
  // implements $('[contenteditable]').val()
  //
  var regexNewLines = /\n/g;
  var regexAmpersands = /&/g;
  var regexLessThanSigns = /</g;
  var regexGreaterThanSigns = />/g;
  var regexWhiteSpaces = /\s+$/g;
  function patchJQueryVal () {
    var origVal = $.fn.val;
    $.fn.val = function(text) {
      if (this.is('[contenteditable]')) {
        if (arguments.length === 0) {
          // .textContent removes all line breaks, which is why we
          // have to use .innerHTML and manually remove all HTML tags
          return this[0].innerText || this[0].textContent;
        }

        text = String(text || '');
        text = text.replace(regexAmpersands, '&amp;');
        text = text.replace(regexLessThanSigns, '&lt;');
        text = text.replace(regexGreaterThanSigns, '&gt;');
        text = text.replace(regexWhiteSpaces, '&nbsp;');
        text = text.replace(regexNewLines, '<br>');
        return this.html( text );
      }
      return origVal.apply(this, arguments);
    };
  }

  //
  // implements $('[contenteditable]').select()
  //
  function patchJQuerySelect () {
    var origSelect = $.fn.select;
    $.fn.select = function() {
      if ($(this).is('[contenteditable]')) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(this[0]);
        selection.removeAllRanges();
        selection.addRange(range);
        return ;
      }
      return origSelect.apply(this, arguments);
    };
  }

  // EXPANDABLE INPUT DATA-API
  // =========================

  $(document).on('focus.bs.expandableInput.data-api', '[contenteditable]', function(event) {
    var $input = $(event.currentTarget);

    // already initialized? Stop here.
    if ($input.data('bs.expandableInput')) return true;

    event.preventDefault();
    event.stopImmediatePropagation();

    // init expandable behaviour
    $input.expandableInput();
    $input.trigger( $.Event(event) );
  });


  // patch jQuery methods
  patchJQueryVal();
  patchJQuerySelect();
})(jQuery);
