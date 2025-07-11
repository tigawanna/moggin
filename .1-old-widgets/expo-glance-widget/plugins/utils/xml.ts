import { FileUtils, Logger } from './fs';

/**
 * Utility functions for XML file operations including merging
 */
export class XmlUtils {
  /**
   * Merges two XML files, combining their content intelligently
   * @param sourcePath - Path to the source XML file
   * @param targetPath - Path to the target XML file to merge into
   * @param strategy - Merge strategy: 'append', 'replace', or 'smart'
   * @returns True if merge was successful
   */
  static mergeXmlFiles(
    sourcePath: string,
    targetPath: string,
    strategy: 'append' | 'replace' | 'smart' = 'smart'
  ): boolean {
    try {
      if (!FileUtils.exists(sourcePath)) {
        Logger.warn(`Source XML file not found: ${sourcePath}`);
        return false;
      }

      const sourceContent = FileUtils.readFileSync(sourcePath);
      
      // If target doesn't exist, just copy the source
      if (!FileUtils.exists(targetPath)) {
        FileUtils.writeFileSync(targetPath, sourceContent);
        Logger.success(`Created XML file: ${targetPath}`);
        return true;
      }

      const targetContent = FileUtils.readFileSync(targetPath);
      
      // Determine XML type and merge accordingly
      if (this.isStringXml(sourceContent) && this.isStringXml(targetContent)) {
        return this.mergeStringXml(sourceContent, targetContent, targetPath);
      } else if (this.isColorXml(sourceContent) && this.isColorXml(targetContent)) {
        return this.mergeColorXml(sourceContent, targetContent, targetPath);
      } else if (this.isDimensXml(sourceContent) && this.isDimensXml(targetContent)) {
        return this.mergeDimensXml(sourceContent, targetContent, targetPath);
      } else if (this.isStyleXml(sourceContent) && this.isStyleXml(targetContent)) {
        return this.mergeStyleXml(sourceContent, targetContent, targetPath);      } else {
        // Generic XML merge for unknown types
        return this.mergeGenericXml(sourceContent, targetContent, targetPath, 'append');
      }
    } catch (error) {
      Logger.error(`Error merging XML files: ${error}`);
      return false;
    }
  }

  /**
   * Merges string resources XML files
   * @param sourceContent - Content of source strings.xml
   * @param targetContent - Content of target strings.xml
   * @param targetPath - Path to write merged content
   * @returns True if successful
   */
  private static mergeStringXml(sourceContent: string, targetContent: string, targetPath: string): boolean {
    try {
      const sourceStrings = this.extractStringResources(sourceContent);
      const targetStrings = this.extractStringResources(targetContent);
      
      // Merge strings, source takes priority for conflicts
      const mergedStrings = { ...targetStrings, ...sourceStrings };
      
      // Build new XML content
      const xmlHeader = '<?xml version="1.0" encoding="utf-8"?>';
      const resourcesOpen = '<resources>';
      const resourcesClose = '</resources>';
      
      const stringEntries = Object.entries(mergedStrings).map(([name, value]) => {
        const translatable = value.translatable !== undefined ? ` translatable="${value.translatable}"` : '';
        return `  <string name="${name}"${translatable}>${value.content}</string>`;
      });
      
      const mergedContent = [
        xmlHeader,
        resourcesOpen,
        ...stringEntries,
        resourcesClose
      ].join('\n');
      
      FileUtils.writeFileSync(targetPath, mergedContent);
      Logger.success(`Merged ${Object.keys(sourceStrings).length} string resources into ${targetPath}`);
      return true;
    } catch (error) {
      Logger.error(`Error merging string XML: ${error}`);
      return false;
    }
  }

  /**
   * Merges color resources XML files
   * @param sourceContent - Content of source colors.xml
   * @param targetContent - Content of target colors.xml
   * @param targetPath - Path to write merged content
   * @returns True if successful
   */
  private static mergeColorXml(sourceContent: string, targetContent: string, targetPath: string): boolean {
    try {
      const sourceColors = this.extractColorResources(sourceContent);
      const targetColors = this.extractColorResources(targetContent);
      
      // Merge colors, source takes priority for conflicts
      const mergedColors = { ...targetColors, ...sourceColors };
      
      // Build new XML content
      const xmlHeader = '<?xml version="1.0" encoding="utf-8"?>';
      const resourcesOpen = '<resources>';
      const resourcesClose = '</resources>';
      
      const colorEntries = Object.entries(mergedColors).map(([name, value]) => {
        return `  <color name="${name}">${value}</color>`;
      });
      
      const mergedContent = [
        xmlHeader,
        resourcesOpen,
        ...colorEntries,
        resourcesClose
      ].join('\n');
      
      FileUtils.writeFileSync(targetPath, mergedContent);
      Logger.success(`Merged ${Object.keys(sourceColors).length} color resources into ${targetPath}`);
      return true;
    } catch (error) {
      Logger.error(`Error merging color XML: ${error}`);
      return false;
    }
  }

  /**
   * Merges dimension resources XML files
   * @param sourceContent - Content of source dimens.xml
   * @param targetContent - Content of target dimens.xml
   * @param targetPath - Path to write merged content
   * @returns True if successful
   */
  private static mergeDimensXml(sourceContent: string, targetContent: string, targetPath: string): boolean {
    try {
      const sourceDimens = this.extractDimensResources(sourceContent);
      const targetDimens = this.extractDimensResources(targetContent);
      
      // Merge dimensions, source takes priority for conflicts
      const mergedDimens = { ...targetDimens, ...sourceDimens };
      
      // Build new XML content
      const xmlHeader = '<?xml version="1.0" encoding="utf-8"?>';
      const resourcesOpen = '<resources>';
      const resourcesClose = '</resources>';
      
      const dimenEntries = Object.entries(mergedDimens).map(([name, value]) => {
        return `  <dimen name="${name}">${value}</dimen>`;
      });
      
      const mergedContent = [
        xmlHeader,
        resourcesOpen,
        ...dimenEntries,
        resourcesClose
      ].join('\n');
      
      FileUtils.writeFileSync(targetPath, mergedContent);
      Logger.success(`Merged ${Object.keys(sourceDimens).length} dimension resources into ${targetPath}`);
      return true;
    } catch (error) {
      Logger.error(`Error merging dimension XML: ${error}`);
      return false;
    }
  }

  /**
   * Merges style resources XML files
   * @param sourceContent - Content of source styles.xml
   * @param targetContent - Content of target styles.xml
   * @param targetPath - Path to write merged content
   * @returns True if successful
   */
  private static mergeStyleXml(sourceContent: string, targetContent: string, targetPath: string): boolean {
    try {
      const sourceStyles = this.extractStyleResources(sourceContent);
      const targetStyles = this.extractStyleResources(targetContent);
      
      // Merge styles, source takes priority for conflicts
      const mergedStyles = { ...targetStyles, ...sourceStyles };
      
      // Build new XML content
      const xmlHeader = '<?xml version="1.0" encoding="utf-8"?>';
      const resourcesOpen = '<resources>';
      const resourcesClose = '</resources>';
      
      const styleEntries = Object.entries(mergedStyles).map(([name, style]) => {
        const parentAttr = style.parent ? ` parent="${style.parent}"` : '';
        const items = style.items.map(item => `    <item name="${item.name}">${item.value}</item>`).join('\n');
        return `  <style name="${name}"${parentAttr}>\n${items}\n  </style>`;
      });
      
      const mergedContent = [
        xmlHeader,
        resourcesOpen,
        ...styleEntries,
        resourcesClose
      ].join('\n');
      
      FileUtils.writeFileSync(targetPath, mergedContent);
      Logger.success(`Merged ${Object.keys(sourceStyles).length} style resources into ${targetPath}`);
      return true;
    } catch (error) {
      Logger.error(`Error merging style XML: ${error}`);
      return false;
    }
  }

  /**
   * Generic XML merge for unknown types
   * @param sourceContent - Source XML content
   * @param targetContent - Target XML content
   * @param targetPath - Path to write merged content
   * @param strategy - Merge strategy
   * @returns True if successful
   */
  private static mergeGenericXml(
    sourceContent: string,
    targetContent: string,
    targetPath: string,
    strategy: 'append' | 'replace'
  ): boolean {
    try {
      let mergedContent: string;
      
      if (strategy === 'replace') {
        mergedContent = sourceContent;
        Logger.info(`Replaced XML content in ${targetPath}`);
      } else {
        // Simple append strategy - merge content between root tags
        const targetRoot = this.extractRootTag(targetContent);
        const sourceRoot = this.extractRootTag(sourceContent);
        
        if (targetRoot && sourceRoot && targetRoot.tagName === sourceRoot.tagName) {
          const mergedInnerContent = targetRoot.innerContent + '\n' + sourceRoot.innerContent;
          mergedContent = `<?xml version="1.0" encoding="utf-8"?>\n<${targetRoot.tagName}${targetRoot.attributes}>\n${mergedInnerContent}\n</${targetRoot.tagName}>`;
          Logger.info(`Appended XML content to ${targetPath}`);
        } else {
          // Fallback to replacement if we can't parse structure
          mergedContent = sourceContent;
          Logger.warn(`Could not parse XML structure, replacing content in ${targetPath}`);
        }
      }
      
      FileUtils.writeFileSync(targetPath, mergedContent);
      return true;
    } catch (error) {
      Logger.error(`Error in generic XML merge: ${error}`);
      return false;
    }
  }

  /**
   * Extracts string resources from strings.xml content
   */
  private static extractStringResources(content: string): Record<string, { content: string; translatable?: string }> {
    const strings: Record<string, { content: string; translatable?: string }> = {};
    
    const stringRegex = /<string\s+name=["']([^"']+)["'](?:\s+translatable=["']([^"']+)["'])?\s*>([^<]*)<\/string>/g;
    let match;
    
    while ((match = stringRegex.exec(content)) !== null) {
      const [, name, translatable, value] = match;
      strings[name] = {
        content: value,
        ...(translatable && { translatable })
      };
    }
    
    return strings;
  }

  /**
   * Extracts color resources from colors.xml content
   */
  private static extractColorResources(content: string): Record<string, string> {
    const colors: Record<string, string> = {};
    
    const colorRegex = /<color\s+name=["']([^"']+)["']\s*>([^<]*)<\/color>/g;
    let match;
    
    while ((match = colorRegex.exec(content)) !== null) {
      const [, name, value] = match;
      colors[name] = value;
    }
    
    return colors;
  }

  /**
   * Extracts dimension resources from dimens.xml content
   */
  private static extractDimensResources(content: string): Record<string, string> {
    const dimens: Record<string, string> = {};
    
    const dimenRegex = /<dimen\s+name=["']([^"']+)["']\s*>([^<]*)<\/dimen>/g;
    let match;
    
    while ((match = dimenRegex.exec(content)) !== null) {
      const [, name, value] = match;
      dimens[name] = value;
    }
    
    return dimens;
  }
  /**
   * Extracts style resources from styles.xml content
   */
  private static extractStyleResources(content: string): Record<string, { parent?: string; items: { name: string; value: string }[] }> {
    const styles: Record<string, { parent?: string; items: { name: string; value: string }[] }> = {};
    
    const styleRegex = /<style\s+name=["']([^"']+)["'](?:\s+parent=["']([^"']+)["'])?\s*>([\s\S]*?)<\/style>/g;
    let match;
    
    while ((match = styleRegex.exec(content)) !== null) {
      const [, name, parent, innerContent] = match;
      
      const items: { name: string; value: string }[] = [];
      const itemRegex = /<item\s+name=["']([^"']+)["']\s*>([^<]*)<\/item>/g;
      let itemMatch;
      
      while ((itemMatch = itemRegex.exec(innerContent)) !== null) {
        const [, itemName, itemValue] = itemMatch;
        items.push({ name: itemName, value: itemValue });
      }
      
      styles[name] = {
        ...(parent && { parent }),
        items
      };
    }
    
    return styles;
  }

  /**
   * Extracts root tag information from XML content
   */
  private static extractRootTag(content: string): { tagName: string; attributes: string; innerContent: string } | null {
    const rootRegex = /<([^>\s]+)([^>]*)>([\s\S]*)<\/\1>/;
    const match = content.match(rootRegex);
    
    if (match) {
      return {
        tagName: match[1],
        attributes: match[2],
        innerContent: match[3].trim()
      };
    }
    
    return null;
  }

  /**
   * Checks if XML content is a strings resource file
   */
  private static isStringXml(content: string): boolean {
    return content.includes('<string') && content.includes('<resources');
  }

  /**
   * Checks if XML content is a colors resource file
   */
  private static isColorXml(content: string): boolean {
    return content.includes('<color') && content.includes('<resources');
  }

  /**
   * Checks if XML content is a dimensions resource file
   */
  private static isDimensXml(content: string): boolean {
    return content.includes('<dimen') && content.includes('<resources');
  }

  /**
   * Checks if XML content is a styles resource file
   */
  private static isStyleXml(content: string): boolean {
    return content.includes('<style') && content.includes('<resources');
  }
}
