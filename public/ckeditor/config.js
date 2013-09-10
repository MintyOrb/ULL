/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.
	// For the complete reference:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

	// The toolbar groups arrangement, optimized for a single toolbar row.
	config.toolbarGroups = [
		{ name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
		{ name: 'forms' },
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
		{ name: 'links' },
		{ name: 'insert' },
		{ name: 'styles' },
		{ name: 'colors' },
		{ name: 'tools' },
		{ name: 'others' },
		{ name: 'about' }
	];

	// The default plugins included in the basic setup define some buttons that
	// we don't want too have in a basic editor. We remove them here.
	config.removeButtons = 'Cut,Copy,Paste,Undo,Redo,Anchor,Underline,Strike,Subscript,Superscript';

	// Let's have it basic on dialogs as well.
    config.removeDialogTabs = 'link:advanced';
    config.linkShowTargetTab = false;
};

//remove linkType and protocol from link popup
CKEDITOR.on( 'dialogDefinition', function( ev )
{
    var dialogName = ev.data.name;
    var dialogDefinition = ev.data.definition;

    if ( dialogName == 'link' )
    {
        var infoTab = dialogDefinition.getContents( 'info' );
        infoTab.remove( 'linkType' );
        infoTab.remove( 'protocol' );

        // FCKConfig.DefaultLinkTarget = '_blank'
        // Get a reference to the "Target" tab.
        var targetTab = dialogDefinition.getContents( 'target' );
        // Set the default value for the URL field.
        var targetField = targetTab.get( 'linkTargetType' );
        targetField[ 'default' ] = '_blank';

    }

});

