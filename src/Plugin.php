<?php

namespace Miaoxing\Rev;

use Miaoxing\Plugin\Service\Asset;

/**
 * @property Asset $asset
 */
class Plugin extends \miaoxing\plugin\BasePlugin
{
    public $name = '素材版本号';

    public $description = '将前端素材生成版本号';

    public function onBeforePageScript()
    {
        if ($this->asset->isEnableRev()) {
            $this->view->display('@rev/rev/beforePageScript.php');
        }
    }
}
