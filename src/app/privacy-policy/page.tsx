
export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 font-headline text-primary">Privacy Policy</h1>
      <div className="prose dark:prose-invert max-w-none lg:prose-lg">
        <p className="lead">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <p>Welcome to Scrapify! Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our web scraping chatbot tool ("Service"). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the Service.</p>

        <h2>1. Information We Collect</h2>
        <p>We may collect information about you in a variety of ways. The information we may collect via the Service includes:</p>
        <ul>
          <li><strong>Usage Data:</strong> When you use Scrapify, we automatically collect information about your interaction with the Service. This may include the URLs you scrape, the features you use, your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the Service.</li>
          <li><strong>Scraped Data History:</strong> If you choose to use features that store your scraping history (e.g., via local storage in your browser), this data is stored on your device and is not transmitted to our servers unless explicitly stated for a specific feature.</li>
          <li><strong>AI Interaction Data:</strong> Information processed by our AI models for summarization and classification is handled as described in our AI Data Usage section.</li>
        </ul>

        <h2>2. Use of Your Information</h2>
        <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Service to:</p>
        <ul>
          <li>Provide, operate, and maintain our Service.</li>
          <li>Improve, personalize, and expand our Service.</li>
          <li>Understand and analyze how you use our Service.</li>
          <li>Develop new products, services, features, and functionality.</li>
          <li>Monitor and analyze usage and trends to improve your experience with the Service.</li>
          <li>Detect, prevent, and address technical issues and security vulnerabilities.</li>
        </ul>

        <h2>3. Disclosure of Your Information</h2>
        <p>We do not sell, trade, rent, or otherwise share your personal information for marketing purposes with third parties. We may share information we have collected about you in certain situations:</p>
        <ul>
          <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
          <li><strong>Third-Party Service Providers:</strong> We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work (e.g., AI model providers for content analysis, hosting services). These third parties are obligated to protect your data and use it only for the purposes for which it was disclosed.</li>
        </ul>
        
        <h2>4. AI Data Usage</h2>
        <p>When you use AI-powered features like content summarization or classification, the relevant content (e.g., text from scraped web pages) is sent to third-party AI model providers (e.g., Google AI via Genkit). These providers process the data to generate the AI output. We strive to use providers with strong privacy and security practices. Please refer to their respective privacy policies for more details on how they handle data.</p>
        <ul>
          <li>Google AI: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Privacy Policy</a></li>
        </ul>
        <p>We do not store the content sent to AI models beyond what is necessary for the operation of the Service, such as in your local scrape history if you use that feature.</p>


        <h2>5. Data Storage and Security</h2>
        <p>We use administrative, technical, and physical security measures to help protect your information. While we have taken reasonable steps to secure the information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
        <p>Scrape history data is primarily stored in your browser's local storage. You have control over this data and can clear it at any time through your browser settings or the application's history management features.</p>

        <h2>6. Your Data Rights</h2>
        <p>Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, or delete your data. As much of the data related to your direct usage (like scrape history) is stored locally, you have direct control over it.</p>

        <h2>7. Cookies and Tracking Technologies</h2>
        <p>We may use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</p>
        <p>Currently, Scrapify primarily uses local storage for functional purposes like storing theme preferences and scrape history. We do not use third-party tracking cookies for advertising.</p>

        <h2>8. Children's Privacy</h2>
        <p>Our Service is not intended for use by children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.</p>
        
        <h2>9. Changes to This Privacy Policy</h2>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>

        <h2>10. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:privacy@scrapify.example.com" className="text-primary hover:underline">privacy@scrapify.example.com</a> (Note: This is a placeholder email).</p>
      </div>
    </div>
  );
}
