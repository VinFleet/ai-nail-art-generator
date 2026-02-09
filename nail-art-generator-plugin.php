<?php
/**
 * Plugin Name: PurelyComfy Nail Art Generator
 * Description: Embeds the AI Nail Art Generator tool anywhere with [nail_art_generator] shortcode
 * Version: 1.0.0
 * Author: Victoria Monroe
 * Author URI: https://purelycomfy.com
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Enqueue necessary scripts and styles
 */
function purelycomfy_nail_generator_enqueue_scripts() {
    // Only enqueue on pages with the shortcode
    global $post;
    if (is_a($post, 'WP_Post') && has_shortcode($post->post_content, 'nail_art_generator')) {
        // Add any necessary styles (if not using iframe)
        wp_enqueue_style(
            'nail-generator-style',
            plugins_url('css/style.css', __FILE__),
            array(),
            '1.0.0'
        );
    }
}
add_action('wp_enqueue_scripts', 'purelycomfy_nail_generator_enqueue_scripts');

/**
 * Shortcode to embed the nail art generator
 * Usage: [nail_art_generator] or [nail_art_generator height="800px" width="100%"]
 */
function purelycomfy_nail_generator_shortcode($atts) {
    // Default attributes
    $atts = shortcode_atts(array(
        'height' => '900px',
        'width' => '100%',
        'url' => 'https://your-vercel-deployment-url.vercel.app', // CHANGE THIS!
        'style' => 'border: none; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'
    ), $atts);
    
    // Build iframe HTML
    $output = sprintf(
        '<div class="nail-art-generator-wrapper" style="max-width: %s; margin: 2rem auto;">
            <iframe 
                src="%s" 
                width="%s" 
                height="%s" 
                style="%s"
                loading="lazy"
                allow="camera; clipboard-write"
                title="AI Nail Art Generator">
            </iframe>
        </div>',
        esc_attr($atts['width']),
        esc_url($atts['url']),
        esc_attr($atts['width']),
        esc_attr($atts['height']),
        esc_attr($atts['style'])
    );
    
    return $output;
}
add_shortcode('nail_art_generator', 'purelycomfy_nail_generator_shortcode');

/**
 * Add settings page (optional)
 */
function purelycomfy_nail_generator_settings_page() {
    add_options_page(
        'Nail Art Generator Settings',
        'Nail Art Generator',
        'manage_options',
        'nail-art-generator',
        'purelycomfy_nail_generator_settings_page_html'
    );
}
add_action('admin_menu', 'purelycomfy_nail_generator_settings_page');

function purelycomfy_nail_generator_settings_page_html() {
    if (!current_user_can('manage_options')) {
        return;
    }
    
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        
        <div class="card" style="max-width: 800px; padding: 20px; margin-top: 20px;">
            <h2>📋 How to Use</h2>
            <p>Add the AI Nail Art Generator to any page or post using the shortcode:</p>
            <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px;"><code>[nail_art_generator]</code></pre>
            
            <h3>Custom Parameters:</h3>
            <ul style="list-style: disc; margin-left: 20px;">
                <li><strong>height</strong> - Set iframe height (default: 900px)</li>
                <li><strong>width</strong> - Set iframe width (default: 100%)</li>
            </ul>
            
            <p><strong>Example:</strong></p>
            <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px;"><code>[nail_art_generator height="800px" width="95%"]</code></pre>
            
            <hr style="margin: 20px 0;">
            
            <h3>🎯 Recommended Page Setup:</h3>
            <ol style="list-style: decimal; margin-left: 20px;">
                <li>Create new page: "AI Nail Art Generator"</li>
                <li>Set permalink: /nail-art-generator/</li>
                <li>Add shortcode: [nail_art_generator]</li>
                <li>Add intro text above shortcode (SEO)</li>
                <li>Publish!</li>
            </ol>
            
            <hr style="margin: 20px 0;">
            
            <h3>✅ SEO Tips:</h3>
            <ul style="list-style: disc; margin-left: 20px;">
                <li>Add 200-300 word intro above the tool</li>
                <li>Include keywords: "nail art generator", "virtual nail try on", "ai nail design"</li>
                <li>Add FAQ section below the tool</li>
                <li>Link to your nail art blog posts</li>
                <li>Encourage social sharing</li>
            </ul>
        </div>
    </div>
    <?php
}

/**
 * Add custom CSS for the wrapper (optional styling)
 */
function purelycomfy_nail_generator_custom_css() {
    ?>
    <style>
        .nail-art-generator-wrapper {
            position: relative;
            overflow: hidden;
        }
        
        .nail-art-generator-wrapper iframe {
            display: block;
            background: #0f172a;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
            .nail-art-generator-wrapper iframe {
                height: 800px !important;
            }
        }
    </style>
    <?php
}
add_action('wp_head', 'purelycomfy_nail_generator_custom_css');
